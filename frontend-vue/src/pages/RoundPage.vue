<script setup lang="ts">
import PageContainer from "@/components/PageContainer.vue";
import RoundPageHeader from "@/components/RoundPageHeader.vue";
import RoundTimer from "@/components/RoundTimer.vue";
import { useRoundTimer } from "@/composables/useRoundTimer";
import {
  useRoundQuery,
  useRoundStatsQuery,
  useRoundWinnerQuery,
} from "@/queries/rounds";
import { computed, toValue } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const roundId = String(route.params.id);

const {
  data: round,
  error,
  isLoading,
  isSuccess: isRoundLoaded,
} = useRoundQuery(roundId);

const roundStatus = computed(
  () => (isRoundLoaded && round.value?.status.value) || "pending",
);

const { data: stats } = useRoundStatsQuery(roundId, isRoundLoaded, roundStatus);

const { data: winner } = useRoundWinnerQuery(
  roundId,
  isRoundLoaded,
  roundStatus,
);

const initTimeLeft = computed(() => round.value?.status.timer || 0);
const isTimerDisabled = computed(
  () => !isRoundLoaded || roundStatus.value === "finished",
);

const timeLeft = useRoundTimer({
  initTimeLeft: initTimeLeft,
  disabled: isTimerDisabled,
  onTimeout: () => {},
});

console.log(
  toValue(round),
  toValue(error),
  toValue(isLoading),
  toValue(isRoundLoaded),
);
</script>

<template>
  <PageContainer>
    <RoundPageHeader />

    <div class="text-white">TODO: Implement Round Page</div>
    <div class="text-white">
      {{ round }}
      {{ stats }}
      {{ winner }}

      <RoundTimer :value="timeLeft" v-if="roundStatus !== 'finished'" />
    </div>
  </PageContainer>
</template>
