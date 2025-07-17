import { FastifyRequest, FastifyReply } from "fastify";
import { verifyToken } from "./utils/auth";

export function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
  done: () => void
) {
  const authHeader = request.headers["authorization"];

  if (!authHeader) {
    console.error("[authMiddleware] No Authorization header");
    reply.code(401).send();
    return;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    console.error("[authMiddleware] Invalid Authorization header format");
    reply.code(401).send();
    return;
  }

  const token = parts[1];

  try {
    const user = verifyToken(token);
    request.user = user;
    request.token = token;
    done();
  } catch (err) {
    console.error("[authMiddleware] Invalid or expired token");
    reply.code(401).send();
  }
}
