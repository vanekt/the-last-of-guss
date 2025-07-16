import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";

const fastify = Fastify({
  logger: true,
});

fastify.register(cors, {
  origin: "*",

  // TODO
  // origin: "https://...", // TODO взять из .env
  // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  // allowedHeaders: ["Content-Type", "Authorization"],
});

fastify.get("/", async () => {
  return { hello: "world" };
});

const start = async () => {
  const port = Number(process.env.PORT);

  if (isNaN(port)) {
    console.error("Please set PORT in your .env file.");
    process.exit(1);
  }

  try {
    await fastify.listen({ port });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
