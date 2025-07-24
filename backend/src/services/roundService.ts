import { eq, desc, and } from "drizzle-orm";
import { db } from "@/db";
import { rounds, userRoundStats, users } from "@/db/schema";
import {
  Round,
  RoundStats,
  RoundStatus,
  RoundWinner,
  TapResponse,
} from "@shared/types";
import { isSuperTap } from "@shared/helpers";
import { SUPER_TAP_SCORE } from "@shared/constants";

if (!process.env.ROUND_DURATION || !process.env.COOLDOWN_DURATION) {
  console.error(
    "Please set ROUND_DURATION and COOLDOWN_DURATION in .env file."
  );
  process.exit(1);
}

const ROUND_DURATION = parseInt(process.env.ROUND_DURATION) * 1000;
const COOLDOWN_DURATION = parseInt(process.env.COOLDOWN_DURATION) * 1000;

export class RoundService {
  static async getAllRounds(): Promise<Round[]> {
    return await db.select().from(rounds).orderBy(desc(rounds.createdAt));
  }

  static async createRound(): Promise<Round> {
    const now = new Date();
    const startTime = new Date(now.getTime() + COOLDOWN_DURATION);
    const endTime = new Date(startTime.getTime() + ROUND_DURATION);

    const [inserted] = await db
      .insert(rounds)
      .values({
        startTime,
        endTime,
        isActive: false,
      })
      .returning();

    return inserted;
  }

  static async getRoundById(id: string): Promise<Round | null> {
    const [data] = await db
      .select()
      .from(rounds)
      .where(eq(rounds.id, id))
      .limit(1);

    return data;
  }

  static getRoundStatus(round: Round): RoundStatus {
    const now = new Date();
    const startTime = new Date(round.startTime);
    const endTime = new Date(round.endTime);

    switch (true) {
      case now < startTime:
        return {
          value: "pending",
          timer: startTime.getTime() - now.getTime(),
        };
      case now >= startTime && now < endTime:
        return {
          value: "active",
          timer: endTime.getTime() - now.getTime(),
        };
      default:
        return {
          value: "finished",
          timer: 0,
        };
    }
  }

  static async isRoundActive(roundId: string): Promise<boolean> {
    const round = await this.getRoundById(roundId);
    if (!round) {
      return false;
    }

    const { value: status } = this.getRoundStatus(round);

    return status === "active";
  }

  static async isRoundFinished(round: Round): Promise<boolean> {
    const { value: status } = this.getRoundStatus(round);
    return status === "finished";
  }

  static async getRoundStats(
    roundId: string,
    userId: string
  ): Promise<RoundStats> {
    const [userStats] = await db
      .select({ taps: userRoundStats.taps, score: userRoundStats.score })
      .from(userRoundStats)
      .where(
        and(
          eq(userRoundStats.userId, userId),
          eq(userRoundStats.roundId, roundId)
        )
      );

    return userStats;
  }

  static async getRoundWinner(round: Round): Promise<RoundWinner | null> {
    if (!round.winnerId) {
      return null;
    }

    const [winnerData] = await db
      .select({ username: users.username, score: userRoundStats.score })
      .from(users)
      .leftJoin(
        userRoundStats,
        and(
          eq(users.id, userRoundStats.userId),
          eq(userRoundStats.roundId, round.id)
        )
      )
      .where(eq(users.id, round.winnerId));

    if (!winnerData) {
      return null;
    }

    return {
      username: winnerData.username,
      score: winnerData.score || 0,
    };
  }

  static async processBatchTaps(
    userId: string,
    roundId: string,
    tapCount: number
  ): Promise<TapResponse> {
    const isActive = await RoundService.isRoundActive(roundId);
    if (!isActive) {
      return {
        success: false,
        taps: 0,
        score: 0,
      };
    }

    return await db.transaction(async (tx) => {
      let [userStats] = await tx
        .insert(userRoundStats)
        .values({ userId, roundId, taps: 0, score: 0 })
        .onConflictDoNothing()
        .returning({
          taps: userRoundStats.taps,
          score: userRoundStats.score,
        });

      if (!userStats) {
        [userStats] = await tx
          .select({ taps: userRoundStats.taps, score: userRoundStats.score })
          .from(userRoundStats)
          .where(
            and(
              eq(userRoundStats.userId, userId),
              eq(userRoundStats.roundId, roundId)
            )
          )
          .for("update");
      }

      const [round] = await tx
        .select({ totalTaps: rounds.totalTaps, totalScore: rounds.totalScore })
        .from(rounds)
        .where(eq(rounds.id, roundId))
        .for("update");

      if (!round) {
        throw new Error(`Round with ID ${roundId} not found.`);
      }

      let tapScoreTotal = 0;
      for (let i = 1; i <= tapCount; i++) {
        if (isSuperTap(userStats.taps + i)) {
          tapScoreTotal += SUPER_TAP_SCORE;
        } else {
          tapScoreTotal += 1;
        }
      }

      const newUserTaps = userStats.taps + tapCount;
      const newUserScore = userStats.score + tapScoreTotal;

      await tx
        .update(userRoundStats)
        .set({ taps: newUserTaps, score: newUserScore })
        .where(
          and(
            eq(userRoundStats.userId, userId),
            eq(userRoundStats.roundId, roundId)
          )
        );

      await tx
        .update(rounds)
        .set({
          totalTaps: round.totalTaps + tapCount,
          totalScore: round.totalScore + tapScoreTotal,
        })
        .where(eq(rounds.id, roundId));

      return {
        success: true,
        taps: newUserTaps,
        score: newUserScore,
      };
    });
  }

  static async finishRound(roundId: string): Promise<string | null> {
    const topUsers = await db
      .select({
        userId: userRoundStats.userId,
        score: userRoundStats.score,
      })
      .from(userRoundStats)
      .where(eq(userRoundStats.roundId, roundId))
      .orderBy(desc(userRoundStats.score))
      .limit(2);

    if (topUsers.length > 0) {
      const maxScore = topUsers[0].score;
      const winners = topUsers.filter((u) => u.score === maxScore);

      if (winners.length === 1) {
        await db
          .update(rounds)
          .set({
            isActive: false,
            winnerId: winners[0].userId,
            winnerScore: winners[0].score,
          })
          .where(eq(rounds.id, roundId));

        return winners[0].userId;
      }
    }

    await db
      .update(rounds)
      .set({ isActive: false })
      .where(eq(rounds.id, roundId));

    return null;
  }
}
