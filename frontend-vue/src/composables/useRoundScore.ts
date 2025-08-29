import { toRef } from "vue";
import { useRoundsStore } from "@/store/roundsStore";

export function useRoundScore(roundId: string) {
  const store = useRoundsStore();
  const round = store.getRoundById(roundId);
  const taps = toRef(round, "score");

  return taps;
}
