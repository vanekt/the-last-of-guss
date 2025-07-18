import { FastifyInstance } from "fastify";
import { RoundService } from "@/services/roundService";
import { RoundStats, RoundWithStatus, RoundWinner } from "@shared/types";

export async function roundRoutes(fastify: FastifyInstance) {
  fastify.get<{
    Reply: { items: RoundWithStatus[] };
  }>("/rounds", { preHandler: fastify.auth }, async (_, reply) => {
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
  }>("/rounds/:id", { preHandler: fastify.auth }, async (request, reply) => {
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
  });

  fastify.post<{
    Reply: RoundWithStatus;
  }>("/rounds", { preHandler: fastify.auth }, async (request, reply) => {
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

  fastify.get<{
    Params: { id: string };
    Reply: RoundStats;
  }>(
    "/rounds/:id/stats",
    { preHandler: fastify.auth },
    async (request, reply) => {
      const { id } = request.params;
      const user = request.user;

      try {
        const stats = await RoundService.getRoundStats(id, user.id);

        if (!stats) {
          return { score: 0, taps: 0 };
        }

        return reply.send(stats);
      } catch (error) {
        return reply.status(500).send();
      }
    }
  );

  fastify.get<{
    Params: { id: string };
    Reply: RoundWinner | null;
  }>(
    "/rounds/:id/winner",
    { preHandler: fastify.auth },
    async (request, reply) => {
      const { id } = request.params;

      try {
        const round = await RoundService.getRoundById(id);
        if (!round) {
          return reply.status(404).send();
        }

        const isFinished = await RoundService.isRoundFinished(round);
        if (isFinished && !round.winnerId) {
          const winnerId = await RoundService.finishRound(round.id);
          round.winnerId = winnerId;
        }

        const winner = await RoundService.getRoundWinner(round);

        return reply.send(winner);
      } catch (error) {
        return reply.status(500).send();
      }
    }
  );

  fastify.post(
    "/rounds/:roundId/tap",
    { preHandler: fastify.auth },
    async (request, reply) => {
      const { roundId } = request.params as { roundId: string };
      const user = request.user;

      if (!user) {
        return reply.status(401).send({ error: "Invalid token" });
      }

      try {
        const result = await RoundService.processTap(user.id, roundId);
        return reply.send(result);
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: "Failed to process tap" });
      }
    }
  );
}
