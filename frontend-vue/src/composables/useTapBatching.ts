import { ref, onMounted, onUnmounted } from "vue";
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

  let intervalId: ReturnType<typeof setInterval> | null = null;

  onMounted(() => {
    intervalId = setInterval(flush, batchTimeout);
  });

  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }

    flush();
  });

  return {
    addTap,
  };
};
