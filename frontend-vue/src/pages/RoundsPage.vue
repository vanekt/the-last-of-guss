<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { Plus } from "lucide-vue-next";
import { toast } from "@steveyuowo/vue-hot-toast";
import type { RoundWithStatus } from "@shared/types";
import Admin from "@/components/Admin.vue";
import GreenButton from "@/components/GreenButton.vue";
import RoundsPageHeader from "@/components/RoundsPageHeader.vue";
import LoadingState from "@/components/LoadingState.vue";
import ErrorState from "@/components/ErrorState.vue";
import NoRoundsBlock from "@/components/NoRoundsBlock.vue";
import RoundCard from "@/components/RoundCard.vue";
import { roundsAPI } from "@/core/api";

const router = useRouter();

const isCreateNewRoundPending = ref(false);
const createButtonTitle = computed(() =>
  isCreateNewRoundPending.value ? "Создание..." : "Создать раунд",
);
const createNewRound = () => {
  isCreateNewRoundPending.value = true;
  roundsAPI
    .createRound()
    .then((data) => {
      toast.success("Раунд создан!");
      router.push(`/rounds/${data.id}`);
    })
    .catch(() => {
      toast.error("Ошибка создания раунда");
    })
    .finally(() => {
      isCreateNewRoundPending.value = false;
    });
};

const isLoading = ref(true);
const isSuccess = ref(false);
const error = ref(false);
const rounds = ref<RoundWithStatus[]>([]);
const hasRounds = computed(() => rounds.value.length > 0);

function fetchRounds(shouldFetchInBackground = false) {
  if (!shouldFetchInBackground) {
    isLoading.value = true;
    error.value = false;
    isSuccess.value = false;
  }

  roundsAPI
    .getRounds()
    .then((resp) => {
      rounds.value = resp.items;
      isSuccess.value = true;
    })
    .catch((e) => {
      console.error(e);
      error.value = true;
    })
    .finally(() => {
      isLoading.value = false;
    });
}

onMounted(() => {
  fetchRounds();
});
</script>

<template>
  <div class="min-h-screen">
    <div class="container mx-auto space-y-12 px-4 py-4 sm:p-8">
      <RoundsPageHeader />

      <div class="space-y-6">
        <Admin>
          <GreenButton
            :title="createButtonTitle"
            :disabled="isCreateNewRoundPending"
            @click="createNewRound"
          >
            <template #icon>
              <Plus class="h-5 w-5" />
            </template>
          </GreenButton>
        </Admin>

        <LoadingState v-if="isLoading" />
        <ErrorState v-if="error" />

        <template v-if="isSuccess">
          <template v-if="hasRounds">
            <RoundCard
              v-for="round in rounds"
              :key="round.id"
              :round="round"
              :onTimeout="() => fetchRounds(true)"
              @click="() => router.push(`/rounds/${round.id}`)"
            >
              {{ round.id }}
            </RoundCard>
          </template>
          <NoRoundsBlock v-else />
        </template>
      </div>
    </div>
  </div>
</template>
