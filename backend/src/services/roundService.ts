import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { rounds } from "@/db/schema";
import { Round, RoundStatus } from "@/types";

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
}
