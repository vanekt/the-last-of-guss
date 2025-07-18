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
          status: "pending",
          timeRemaining: startTime.getTime() - now.getTime(),
        };
      case now >= startTime && now < endTime:
        return {
          status: "active",
          timeRemaining: endTime.getTime() - now.getTime(),
        };
      default:
        return {
          status: "finished",
          timeRemaining: 0,
        };
    }
  }

  static async isRoundActive(roundId: string): Promise<boolean> {
    const round = await this.getRoundById(roundId);
    if (!round) {
      return false;
    }

    const { status } = this.getRoundStatus(round);

    return status === "active";
  }

  static async isRoundFinished(round: Round): Promise<boolean> {
    const { status } = this.getRoundStatus(round);
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

  static async processTap(
    userId: string,
    roundId: string
  ): Promise<TapResponse> {
    const t0 = Date.now();
    const isActive = await this.isRoundActive(roundId);
    const t1 = Date.now();

    if (!isActive) {
      return {
        success: false,
        taps: 0,
        score: 0,
      };
    }

    const t2 = Date.now();
    const result = await db.transaction(async (tx) => {
      const t3 = Date.now();
      const [userStats] = await tx
        .insert(userRoundStats)
        .values({
          userId,
          roundId,
          taps: 1,
          score: 1,
        })
        .onConflictDoUpdate({
          target: [userRoundStats.userId, userRoundStats.roundId],
          set: {
            taps: sql`${userRoundStats.taps} + 1`,
            score: sql`${userRoundStats.score} + CASE WHEN (${userRoundStats.taps} + 1) % 11 = 0 THEN 10 ELSE 1 END`,
          },
        })
        .returning({ taps: userRoundStats.taps, score: userRoundStats.score });
      const t4 = Date.now();
      await tx
        .update(rounds)
        .set({
          totalTaps: sql`${rounds.totalTaps} + 1`,
          totalScore: sql`${rounds.totalScore} + CASE WHEN (${rounds.totalTaps} + 1) % 11 = 0 THEN 10 ELSE 1 END`,
        })
        .where(eq(rounds.id, roundId));
      const t5 = Date.now();
      console.log("[processTap] upsert userRoundStats:", t4 - t3, "ms");
      console.log("[processTap] update rounds:", t5 - t4, "ms");
      return {
        success: true,
        taps: userStats.taps,
        score: userStats.score,
      };
    });
    const t6 = Date.now();
    console.log("[processTap] isRoundActive:", t1 - t0, "ms");
    console.log("[processTap] transaction start:", t2 - t1, "ms");
    console.log("[processTap] transaction total:", t6 - t2, "ms");
    return result;
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
