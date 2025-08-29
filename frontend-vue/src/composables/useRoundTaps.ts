import { toRef } from "vue";
import { useRoundsStore } from "@/store/roundsStore";

export function useRoundTaps(roundId: string) {
  const store = useRoundsStore();
  const round = store.getRoundById(roundId);
  const taps = toRef(round, "taps");

  return taps;
}
