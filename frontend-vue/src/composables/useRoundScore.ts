import { readonly, toRef, toValue, type MaybeRefOrGetter } from "vue";
import { useRoundsStore } from "@/store/roundsStore";

export function useRoundScore(roundId: MaybeRefOrGetter<string>) {
  const store = useRoundsStore();
  const round = store.getRoundById(toValue(roundId));
  const score = toRef(round, "score");

  function setScore(value: number) {
    score.value = value;
  }

  function incrementScore(value: number = 1) {
    score.value += value;
  }

  return { score: readonly(score), setScore, incrementScore };
}
