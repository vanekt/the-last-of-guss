import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).notNull().default("survivor"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rounds = pgTable("rounds", {
  id: uuid("id").defaultRandom().primaryKey(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  isActive: boolean("is_active").notNull().default(false),
  totalTaps: integer("total_taps").notNull().default(0),
  totalScore: integer("total_score").notNull().default(0),
  winnerId: uuid("winner_id").references(() => users.id),
  winnerScore: integer("winner_score").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userRoundStats = pgTable(
  "user_round_stats",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    roundId: uuid("round_id")
      .notNull()
      .references(() => rounds.id),
    taps: integer("taps").notNull().default(0),
    score: integer("score").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("user_round_stats_user_id_round_id_unique").on(
      table.userId,
      table.roundId
    ),
  ]
);

export const usersRelations = relations(users, ({ many }) => ({
  roundStats: many(userRoundStats),
}));

export const roundsRelations = relations(rounds, ({ many, one }) => ({
  userStats: many(userRoundStats),
  winner: one(users, {
    fields: [rounds.winnerId],
    references: [users.id],
  }),
}));

export const userRoundStatsRelations = relations(userRoundStats, ({ one }) => ({
  user: one(users, {
    fields: [userRoundStats.userId],
    references: [users.id],
  }),
  round: one(rounds, {
    fields: [userRoundStats.roundId],
    references: [rounds.id],
  }),
}));
