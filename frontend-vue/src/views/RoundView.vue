<script setup lang="ts">
import { computed, toRefs, watch, watchEffect } from "vue";
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

const props = defineProps<{ id: string }>();
const { id: roundId } = toRefs(props);

const authStore = useAuthStore();

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

const { timeLeft } = useRoundTimer({
  initTimeLeft: () => round.value?.status.timer || 0,
  disabled: () => !isRoundLoaded || roundStatus.value === "finished",
});

const { taps, setTaps, incrementTaps } = useRoundTaps(roundId);
const { score, setScore, incrementScore } = useRoundScore(roundId);
watch(stats, (newStats) => {
  setTaps(newStats.taps);
  setScore(newStats.score);
});

const shouldIgnoreTap = isNikita(authStore.userRole!);
const { addTap: addTapToBatch } = useTapBatching({
  roundId,
  disabled: () => roundStatus.value !== "active",
});

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
            v-bind="{
              accent: isSuperTap(taps + 1),
              disabled: roundStatus !== 'active',
              floatableLabel,
            }"
            @click="handleTap"
          />

          <div class="space-y-2 align-middle">
            <RoundStatus v-bind="{ status: roundStatus! }" />
            <RoundTimer
              v-if="roundStatus !== 'finished'"
              v-bind="{ value: timeLeft }"
            />
          </div>

          <UserStats
            v-bind="{
              isReady: !isStatsEnabled || isStatsFetched,
              score,
              taps,
            }"
          />

          <RoundSummary
            v-if="roundStatus === 'finished'"
            v-bind="{
              isReady: isWinnerLoaded,
              totalTaps: round?.totalTaps || 0,
              totalScore: round?.totalScore || 0,
              winner,
            }"
          />

          <NikitaWarning v-if="roundStatus === 'active' && shouldIgnoreTap" />
        </div>
      </template>
    </div>
  </PageContainer>
</template>
