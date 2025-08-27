<script setup lang="ts">
import PageContainer from "@/components/PageContainer.vue";
import RoundPageHeader from "@/components/RoundPageHeader.vue";
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
    </div>
  </PageContainer>
</template>
