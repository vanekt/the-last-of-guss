import { ref, onUnmounted } from "vue";
import { useInterval } from "@vueuse/core";
import { useTapBatchMutation } from "@/mutations/rounds";

interface UseTapBatchingOptions {
  roundId: string;
  batchTimeout?: number;
  maxBatchSize?: number;
}

export const useTapBatching = ({
  roundId,
  batchTimeout = 300,
  maxBatchSize = 10,
}: UseTapBatchingOptions) => {
  const pendingTaps = ref<number>(0);
  const { mutate } = useTapBatchMutation(roundId);

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

  useInterval(batchTimeout, {
    callback: flush,
  });

  onUnmounted(flush);

  return {
    addTap,
  };
};
