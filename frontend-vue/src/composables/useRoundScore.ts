import { readonly, toRef } from "vue";
import { useRoundsStore } from "@/store/roundsStore";

export function useRoundScore(roundId: string) {
  const store = useRoundsStore();
  const round = store.getRoundById(roundId);
  const score = toRef(round, "score");

  function setScore(value: number) {
    score.value = value;
  }

  function incrementScore(value: number = 1) {
    score.value += value;
  }

  return { score: readonly(score), setScore, incrementScore };
}
