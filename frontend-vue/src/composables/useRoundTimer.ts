import { computed, watch, type ComputedGetter } from "vue";
import { useCountdown } from "@vueuse/core";

interface UseRoundTimerOptions {
  initTimeLeft: ComputedGetter<number>;
  disabled: ComputedGetter<boolean>;
  onComplete?: () => void;
}

export function useRoundTimer({
  initTimeLeft,
  disabled,
  onComplete,
}: UseRoundTimerOptions) {
  const { remaining, start, stop } = useCountdown(() => initTimeLeft() / 1000, {
    onComplete,
  });

  watch(
    [disabled, initTimeLeft],
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
