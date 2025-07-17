import { FastifyInstance } from "fastify";
import { RoundService } from "@/services/roundService";
import { RoundWithStatus } from "@/types";

export async function roundRoutes(fastify: FastifyInstance) {
  fastify.get<{
    Reply: { items: RoundWithStatus[] };
  }>("/api/rounds", { preHandler: fastify.auth }, async (_, reply) => {
    try {
      const roundsData = await RoundService.getAllRounds();

      return reply.send({
        items: roundsData.map((round) => ({
          ...round,
          status: RoundService.getRoundStatus(round),
        })),
      });
    } catch (error) {
      return reply.status(500).send();
    }
  });

  fastify.get<{
    Params: { id: string };
    Reply: RoundWithStatus;
  }>(
    "/api/rounds/:id",
    { preHandler: fastify.auth },
    async (request, reply) => {
      const { id } = request.params;

      try {
        const round = await RoundService.getRoundById(id);

        if (!round) {
          return reply.status(404).send();
        }

        return reply.send({
          ...round,
          status: RoundService.getRoundStatus(round),
        });
      } catch (error) {
        return reply.status(500).send();
      }
    }
  );

  fastify.post<{
    Reply: RoundWithStatus;
  }>("/api/rounds", { preHandler: fastify.auth }, async (request, reply) => {
    const user = request.user;

    if (!user || user.role !== "admin") {
      return reply.status(403).send();
    }

    try {
      const round = await RoundService.createRound();

      return reply.send({
        ...round,
        status: RoundService.getRoundStatus(round),
      });
    } catch (error) {
      return reply.status(500).send();
    }
  });
}
