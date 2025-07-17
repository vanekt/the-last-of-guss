import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { authMiddleware } from "./middleware";
import { authRoutes } from "./routes/auth";
import { roundRoutes } from "./routes/rounds";

const fastify = Fastify({
  logger: true,
});

fastify.register(cors, {
  origin: "*",

  // TODO
  // origin: process.env.CORS_ORIGIN,
  // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  // allowedHeaders: ["Content-Type", "Authorization"],
});

fastify.decorate("auth", authMiddleware);

fastify.register(authRoutes);
fastify.register(roundRoutes);

const start = async () => {
  const port = Number(process.env.PORT);

  if (isNaN(port)) {
    console.error("Please set PORT in your .env file.");
    process.exit(1);
  }

  try {
    await fastify.listen({ port });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
