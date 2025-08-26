import {
  ref,
  watch,
  onMounted,
  onUnmounted,
  type ComputedRef,
  type Ref,
} from "vue";

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
  let interval: ReturnType<typeof setInterval> | null = null;

  const clear = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };

  const start = () => {
    clear();

    if (disabled.value) {
      return;
    }

    interval = setInterval(() => {
      if (timeLeft.value <= 0) {
        clear();

        timeLeft.value = 0;

        onTimeout();
        return;
      }

      timeLeft.value -= 1000;
    }, 1000);
  };

  watch(
    [initTimeLeft, disabled],
    ([newTime, isDisabled]) => {
      clear();

      timeLeft.value = newTime;

      if (!isDisabled) {
        start();
      }
    },
    { immediate: true },
  );

  onMounted(() => {
    if (!disabled.value) {
      start();
    }
  });

  onUnmounted(clear);

  return timeLeft;
}
