import { ref } from "vue";
import { defineStore } from "pinia";

interface Round {
  taps: number;
  score: number;
}

export const useRoundsStore = defineStore("rounds", () => {
  const rounds = ref<Record<string, Round>>({});

  const getRoundById = (roundId: string): Round => {
    if (Object.hasOwn(rounds.value, roundId)) {
      return rounds.value[roundId];
    }

    rounds.value[roundId] = {
      taps: 0,
      score: 0,
    };

    return rounds.value[roundId];
  };

  return {
    rounds,
    getRoundById,
  };
});
