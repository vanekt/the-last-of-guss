import { eq, desc, and, sql } from "drizzle-orm";
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
      let [stats] = await tx
        .select({ taps: userRoundStats.taps, score: userRoundStats.score })
        .from(userRoundStats)
        .where(
          and(
            eq(userRoundStats.userId, userId),
            eq(userRoundStats.roundId, roundId)
          )
        );

      let currentTaps = stats?.taps ?? 0;
      let currentScore = stats?.score ?? 0;

      if (!stats) {
        await tx.insert(userRoundStats).values({
          userId,
          roundId,
          taps: 0,
          score: 0,
        });
      }

      const newTaps = currentTaps + tapCount;
      let totalTapScore = 0;
      for (let i = 1; i <= tapCount; i++) {
        if (isSuperTap(currentTaps + i)) {
          totalTapScore += SUPER_TAP_SCORE;
        } else {
          totalTapScore += 1;
        }
      }
      const newScore = currentScore + totalTapScore;

      await tx
        .update(userRoundStats)
        .set({ taps: newTaps, score: newScore })
        .where(
          and(
            eq(userRoundStats.userId, userId),
            eq(userRoundStats.roundId, roundId)
          )
        );

      return {
        success: true,
        taps: newTaps,
        score: newScore,
      };
    });
  }

  static async finishRound(roundId: string): Promise<string> {
    const [winner] = await db
      .select({
        userId: userRoundStats.userId,
        score: userRoundStats.score,
      })
      .from(userRoundStats)
      .where(eq(userRoundStats.roundId, roundId))
      .orderBy(desc(userRoundStats.score))
      .limit(1);

    if (winner) {
      await db
        .update(rounds)
        .set({
          winnerId: winner.userId,
          winnerScore: winner.score,
          isActive: false,
        })
        .where(eq(rounds.id, roundId));
    } else {
      await db
        .update(rounds)
        .set({ isActive: false })
        .where(eq(rounds.id, roundId));
    }

    return winner?.userId;
  }
}
