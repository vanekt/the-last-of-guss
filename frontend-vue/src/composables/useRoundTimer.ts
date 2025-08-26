import { ref, watch, onWatcherCleanup } from "vue";
import type { ComputedRef, Ref } from "vue";

interface UseRoundTimerOptions {
  initTimeLeft: ComputedRef<number>;
  disabled: ComputedRef<boolean>;
  onTimeout: () => void;
}

export function useRoundTimer({
  initTimeLeft,
  disabled,
  onTimeout,
}: UseRoundTimerOptions): Ref<number> {
  const timeLeft = ref(initTimeLeft.value);

  watch([initTimeLeft], ([newTime]) => {
    timeLeft.value = newTime;
  });

  watch(
    [disabled],
    ([isDisabled]) => {
      if (isDisabled) {
        return;
      }

      const interval = setInterval(() => {
        const newValue = timeLeft.value - 1000;

        if (newValue < 0) {
          onTimeout();
          timeLeft.value = 0;
          return;
        }

        timeLeft.value = newValue;
      }, 1000);

      onWatcherCleanup(() => {
        clearInterval(interval);
      });
    },
    { immediate: true },
  );

  return timeLeft;
}
