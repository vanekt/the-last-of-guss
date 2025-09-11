import { readonly, toRef, type Ref } from "vue";
import { useRoundsStore } from "@/store/roundsStore";

export function useRoundScore(roundId: Ref<string>) {
  const store = useRoundsStore();
  const round = store.getRoundById(roundId.value);
  const score = toRef(round, "score");

  function setScore(value: number) {
    score.value = value;
  }

  function incrementScore(value: number = 1) {
    score.value += value;
  }

  return { score: readonly(score), setScore, incrementScore };
}
