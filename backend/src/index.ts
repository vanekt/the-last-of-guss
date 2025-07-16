import "dotenv/config";
import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
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
