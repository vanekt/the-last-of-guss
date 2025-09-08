import { computed, toValue, watch, type MaybeRefOrGetter } from "vue";
import { useCountdown } from "@vueuse/core";

interface UseRoundTimerOptions {
  initTimeLeft: MaybeRefOrGetter<number>;
  disabled: MaybeRefOrGetter<boolean>;
  onComplete?: () => void;
}

export function useRoundTimer({
  initTimeLeft,
  disabled,
  onComplete,
}: UseRoundTimerOptions) {
  const { remaining, start, stop } = useCountdown(
    () => toValue(initTimeLeft) / 1000,
    { onComplete },
  );

  watch(
    [() => toValue(disabled), () => toValue(initTimeLeft)],
    ([isDisabled, initTime]) => {
      if (isDisabled) {
        stop();
      } else if (initTime > 0) {
        start();
      }
    },
    { immediate: true },
  );

  return {
    timeLeft: computed(() => remaining.value * 1000),
  };
}
