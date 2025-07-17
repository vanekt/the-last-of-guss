import { FastifyInstance } from "fastify";
import { RoundService } from "@/services/roundService";
import { verifyToken } from "@/utils/auth";
import { RoundWithStatus } from "@/types";

export async function roundRoutes(fastify: FastifyInstance) {
  fastify.get<{
    Reply: { items: RoundWithStatus[] };
  }>("/api/rounds", async (_, reply) => {
    // TODO auth middleware !!!

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
  }>("/api/rounds/:id", async (request, reply) => {
    // TODO auth middleware !!!
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
  }>("/api/rounds", async (request, reply) => {
    // TODO !!!! здесь надо брать юзера из контекста !!! для этого нужно добавить middleware для fastify
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.status(401).send();
    }

    const token = authHeader.substring(7);
    const user = verifyToken(token);

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
