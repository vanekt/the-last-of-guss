import "fastify";
import { FastifyRequest, FastifyReply } from "fastify";
import { UserPayload } from ".";

export type AuthMiddleware = (
  request: FastifyRequest,
  reply: FastifyReply,
  done: () => void
) => void;

declare module "fastify" {
  interface FastifyInstance {
    auth: AuthMiddleware;
  }

  interface FastifyRequest {
    user: UserPayload | null;
    token?: string;
  }
}
