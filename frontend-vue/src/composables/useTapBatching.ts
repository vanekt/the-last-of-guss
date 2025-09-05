import {
  ref,
  toValue,
  watchEffect,
  onUnmounted,
  type MaybeRefOrGetter,
} from "vue";
import { useIntervalFn } from "@vueuse/core";
import { useTapBatchMutation } from "@/mutations/rounds";

interface UseTapBatchingOptions {
  roundId: MaybeRefOrGetter<string>;
  batchTimeout?: number;
  maxBatchSize?: number;
  disabled: MaybeRefOrGetter<boolean>;
}

export const useTapBatching = ({
  roundId,
  batchTimeout = 300,
  maxBatchSize = 10,
  disabled,
}: UseTapBatchingOptions) => {
  const pendingTaps = ref<number>(0);
  const { mutate } = useTapBatchMutation(toValue(roundId));

  const flush = () => {
    if (pendingTaps.value < 1) {
      return;
    }

    mutate(pendingTaps.value);
    pendingTaps.value = 0;
  };

  const addTap = () => {
    pendingTaps.value++;
    if (pendingTaps.value >= maxBatchSize) {
      flush();
    }
  };

  const { pause, resume } = useIntervalFn(flush, batchTimeout);

  watchEffect(() => {
    if (toValue(disabled)) {
      pause();
    } else {
      resume();
    }
  });

  onUnmounted(flush);

  return {
    addTap,
  };
};
