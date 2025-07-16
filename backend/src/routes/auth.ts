import { FastifyInstance, FastifyRequest } from "fastify";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema.js";
import {
  hashPassword,
  comparePassword,
  generateToken,
  getUserRole,
  verifyToken,
} from "@/utils/auth.js";

type LoginRequest = {
  Body: {
    username: string;
    password: string;
  };
};

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/auth/login",
    {
      schema: {
        body: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string", minLength: 1 },
            password: { type: "string", minLength: 1 },
          },
          additionalProperties: false,
        },
      },
    },
    async (request: FastifyRequest<LoginRequest>, reply) => {
      const { username, password } = request.body;

      try {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.username, username));

        if (user) {
          const isValid = await comparePassword(password, user.password);

          if (!isValid) {
            return reply.status(401).send({ error: "Invalid credentials" });
          }

          return reply.send({
            token: generateToken(user),
            user,
          });
        } else {
          const role = getUserRole(username);
          const hashedPassword = await hashPassword(password);

          const [user] = await db
            .insert(users)
            .values({
              username,
              password: hashedPassword,
              role,
            })
            .returning();

          return reply.send({
            token: generateToken(user),
            user,
          });
        }
      } catch (error) {
        console.error("Login error:", error);
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );

  fastify.post("/auth/verify", async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.status(401).send({ error: "No token provided" });
    }

    const token = authHeader.substring(7);
    const user = verifyToken(token);

    if (!user) {
      return reply.status(401).send({ error: "Invalid token" });
    }

    return reply.send({ user });
  });
}
