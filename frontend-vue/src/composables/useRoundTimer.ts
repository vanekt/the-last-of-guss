import { ref, toValue, watchEffect, type MaybeRefOrGetter } from "vue";
import { useInterval } from "@vueuse/core";

interface UseRoundTimerOptions {
  initTimeLeft: MaybeRefOrGetter<number>;
  disabled: MaybeRefOrGetter<boolean>;
  onTimeout?: () => void;
}

export function useRoundTimer({
  initTimeLeft,
  disabled,
  onTimeout,
}: UseRoundTimerOptions) {
  const timeLeft = ref(toValue(initTimeLeft));

  watchEffect(() => {
    timeLeft.value = toValue(initTimeLeft);
  });

  const { pause, resume } = useInterval(1000, {
    controls: true,
    immediate: false,
    callback: () => {
      const newValue = timeLeft.value - 1000;

      if (newValue < 0) {
        onTimeout?.();
        timeLeft.value = 0;
        return;
      }

      timeLeft.value = newValue;
    },
  });

  watchEffect(() => {
    toValue(disabled) ? pause() : resume();
  });

  return { timeLeft };
}
