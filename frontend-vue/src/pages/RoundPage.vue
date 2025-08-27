<script setup lang="ts">
import ErrorState from "@/components/ErrorState.vue";
import LoadingState from "@/components/LoadingState.vue";
import PageContainer from "@/components/PageContainer.vue";
import RoundPageHeader from "@/components/RoundPageHeader.vue";
import RoundStatus from "@/components/RoundStatus.vue";
import RoundSummary from "@/components/RoundSummary.vue";
import RoundTimer from "@/components/RoundTimer.vue";
import UserStats from "@/components/UserStats.vue";
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

    <div class="mx-auto max-w-2xl">
      <LoadingState v-if="isLoading" />

      <ErrorState v-if="error" />

      <template v-if="isRoundLoaded">
        <div
          class="space-y-4 rounded-2xl border border-white/20 bg-white/10 p-8 text-center backdrop-blur-lg"
        >
          {{ round }}

          <div class="space-y-2 align-middle">
            <RoundStatus :status="roundStatus" />
            <RoundTimer v-if="roundStatus !== 'finished'" :value="timeLeft" />
          </div>

          <UserStats :score="stats.score" :taps="stats.taps" />

          <RoundSummary
            v-if="roundStatus === 'finished'"
            :total-taps="round?.totalTaps || 0"
            :total-score="round?.totalScore || 0"
            :winner="winner"
          />
        </div>
      </template>
    </div>
  </PageContainer>
</template>
