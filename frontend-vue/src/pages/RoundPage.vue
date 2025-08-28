<script setup lang="ts">
import { computed, ref, watch } from "vue";
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

const route = useRoute();
const authStore = useAuthStore();
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
});

const taps = ref(stats.value.taps);
const score = ref(stats.value.score);
watch(stats, (newStats) => {
  taps.value = newStats.taps;
  score.value = newStats.score;
});

const shouldIgnoreTap = isNikita(authStore.userRole!);
const { addTap } = useTapBatching({ roundId });

const handleTap = () => {
  if (shouldIgnoreTap) {
    return;
  }

  addTap();

  taps.value++;
  if (isSuperTap(taps.value)) {
    score.value += SUPER_TAP_SCORE;
  } else {
    score.value++;
  }
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
            :floatableLabel="floatableLabel"
            @click="handleTap"
          />

          <div class="space-y-2 align-middle">
            <RoundStatus :status="roundStatus" />
            <RoundTimer v-if="roundStatus !== 'finished'" :value="timeLeft" />
          </div>

          <UserStats :score="score" :taps="taps" />

          <RoundSummary
            v-if="roundStatus === 'finished'"
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
