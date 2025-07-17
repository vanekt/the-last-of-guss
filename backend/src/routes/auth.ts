import { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import {
  hashPassword,
  comparePassword,
  generateToken,
  getUserRole,
} from "@/utils/auth";
import { UserPayload } from "@shared/types";

type LoginRequest = {
  username: string;
  password: string;
};

type LoginResponse = {
  token: string;
  user: UserPayload;
};

type VerifyResponse = {
  user: UserPayload;
};

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post<{
    Body: LoginRequest;
    Reply: LoginResponse;
  }>(
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
    async (request, reply) => {
      const { username, password } = request.body;

      try {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.username, username));

        if (user) {
          const isValid = await comparePassword(password, user.password);

          if (!isValid) {
            return reply.status(401).send();
          }

          return reply.status(200).send({
            token: generateToken(user),
            user: {
              id: user.id,
              username: user.username,
              role: user.role,
            },
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

          return reply.status(200).send({
            token: generateToken(user),
            user: {
              id: user.id,
              username: user.username,
              role: user.role,
            },
          });
        }
      } catch (error) {
        console.error("Login error:", error);
        return reply.status(500).send();
      }
    }
  );

  fastify.post<{
    Headers: {
      authorization: string;
    };
    Reply: VerifyResponse;
  }>("/auth/verify", { preHandler: fastify.auth }, async (request, reply) => {
    return reply.send({ user: request.user! });
  });
}
