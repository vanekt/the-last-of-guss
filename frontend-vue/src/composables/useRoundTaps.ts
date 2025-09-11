import { readonly, toRef, type Ref } from "vue";
import { useRoundsStore } from "@/store/roundsStore";

export function useRoundTaps(roundId: Ref<string>) {
  const store = useRoundsStore();
  const round = store.getRoundById(roundId.value);
  const taps = toRef(round, "taps");

  function setTaps(value: number) {
    taps.value = value;
  }

  function incrementTaps() {
    taps.value++;
  }

  return { taps: readonly(taps), setTaps, incrementTaps };
}
