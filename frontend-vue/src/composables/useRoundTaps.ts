import { readonly, toRef, toValue, type MaybeRefOrGetter } from "vue";
import { useRoundsStore } from "@/store/roundsStore";

export function useRoundTaps(roundId: MaybeRefOrGetter<string>) {
  const store = useRoundsStore();
  const round = store.getRoundById(toValue(roundId));
  const taps = toRef(round, "taps");

  function setTaps(value: number) {
    taps.value = value;
  }

  function incrementTaps() {
    taps.value++;
  }

  return { taps: readonly(taps), setTaps, incrementTaps };
}
