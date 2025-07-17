import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  integer,
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
