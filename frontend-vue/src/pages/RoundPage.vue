<script setup lang="ts">
import { computed, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { SUPER_TAP_SCORE } from "@shared/constants";
import { isNikita, isSuperTap } from "@shared/helpers";
import ErrorState from "@/components/ErrorState.vue";
import GooseTapButton from "@/components/GooseTapButton.vue";
import LoadingState from "@/components/LoadingState.vue";
import NikitaWarning from "@/components/NikitaWarning.vue";
import PageContainer from "@/components/PageContainer.vue";
import RoundPageHeader from "@/components/RoundPageHeader.vue";
import RoundStatus from "@/components/RoundStatus.vue";
import RoundSummary from "@/components/RoundSummary.vue";
import RoundTimer from "@/components/RoundTimer.vue";
import UserStats from "@/components/UserStats.vue";
import { useRoundTimer } from "@/composables/useRoundTimer";
import { useTapBatching } from "@/composables/useTapBatching";
import {
  useRoundQuery,
  useRoundStatsQuery,
  useRoundWinnerQuery,
} from "@/queries/rounds";
import { useAuthStore } from "@/store/authStore";
import { useRoundScore } from "@/composables/useRoundScore";
import { useRoundTaps } from "@/composables/useRoundTaps";
import { usePageTitle } from "@/composables/usePageTitle";
import { getStatusInfo } from "@/utils/getStatusInfo";

const route = useRoute();
const authStore = useAuthStore();
const roundId = String(route.params.id);

const {
  data: round,
  error,
  isLoading,
  isSuccess: isRoundLoaded,
} = useRoundQuery(roundId);

const roundStatus = computed(() => round.value?.status.value);

const {
  data: stats,
  isEnabled: isStatsEnabled,
  isFetched: isStatsFetched,
} = useRoundStatsQuery(roundId, roundStatus);

const { data: winner, isFetched: isWinnerLoaded } = useRoundWinnerQuery(
  roundId,
  roundStatus,
);

const { setTitle } = usePageTitle("Раунд");
watchEffect(() => {
  if (roundStatus.value) {
    setTitle(getStatusInfo(roundStatus.value).titleAlt!);
  }
});

const initTimeLeft = computed(() => round.value?.status.timer || 0);
const isTimerDisabled = computed(
  () => !isRoundLoaded || roundStatus.value === "finished",
);

const { timeLeft } = useRoundTimer({
  initTimeLeft: initTimeLeft,
  disabled: isTimerDisabled,
});

const { taps, setTaps, incrementTaps } = useRoundTaps(roundId);
const { score, setScore, incrementScore } = useRoundScore(roundId);
watch(stats, (newStats) => {
  setTaps(newStats.taps);
  setScore(newStats.score);
});

const shouldIgnoreTap = isNikita(authStore.userRole!);
const { addTap: addTapToBatch } = useTapBatching({ roundId });

const handleTap = () => {
  if (shouldIgnoreTap) {
    return;
  }

  addTapToBatch();

  incrementTaps();
  incrementScore(isSuperTap(taps.value) ? SUPER_TAP_SCORE : 1);
};

const floatableLabel = computed(() => {
  if (shouldIgnoreTap) {
    return "+0";
  }

  return isSuperTap(taps.value + 1) ? `+${SUPER_TAP_SCORE}` : "+1";
});
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
          <GooseTapButton
            :disabled="roundStatus !== 'active'"
            :accent="isSuperTap(taps + 1)"
            :floatable-label="floatableLabel"
            @click="handleTap"
          />

          <div class="space-y-2 align-middle">
            <RoundStatus :status="roundStatus!" />
            <RoundTimer v-if="roundStatus !== 'finished'" :value="timeLeft" />
          </div>

          <UserStats
            :is-ready="!isStatsEnabled || isStatsFetched"
            :score="score"
            :taps="taps"
          />

          <RoundSummary
            v-if="roundStatus === 'finished'"
            :is-ready="isWinnerLoaded"
            :total-taps="round?.totalTaps || 0"
            :total-score="round?.totalScore || 0"
            :winner="winner"
          />

          <NikitaWarning v-if="roundStatus === 'active' && shouldIgnoreTap" />
        </div>
      </template>
    </div>
  </PageContainer>
</template>
