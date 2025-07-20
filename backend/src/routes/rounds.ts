import { FastifyInstance } from "fastify";
import { RoundService } from "@/services/roundService";
import {
  RoundsResponse,
  RoundResponse,
  RoundStatsResponse,
  RoundWinnerResponse,
  TapBatchRequest,
} from "@shared/types";

export async function roundRoutes(fastify: FastifyInstance) {
  fastify.get<{
    Reply: RoundsResponse;
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
    Reply: RoundResponse;
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
    Reply: RoundResponse;
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
    Reply: RoundStatsResponse;
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
    Reply: RoundWinnerResponse;
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

  fastify.post<{
    Params: { roundId: string };
    Body: TapBatchRequest;
  }>(
    "/rounds/:roundId/tap/batch",
    { preHandler: fastify.auth },
    async (request, reply) => {
      const { roundId } = request.params;
      const user = request.user;

      if (!user) {
        return reply.status(401).send({ error: "Invalid token" });
      }

      const { tapCount } = request.body;
      if (!tapCount || tapCount <= 0) {
        return reply.status(400).send({ error: "Invalid tap count" });
      }

      if (user.role === "nikita") {
        return reply.send({
          success: false,
          taps: 0,
          score: 0,
        });
      }

      try {
        const result = await RoundService.processBatchTaps(
          user.id,
          roundId,
          tapCount
        );
        return reply.send(result);
      } catch (error) {
        return reply
          .status(500)
          .send({ error: "Failed to process batch taps" });
      }
    }
  );
}
