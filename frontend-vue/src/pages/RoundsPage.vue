<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Plus } from "lucide-vue-next";
import Admin from "@/components/Admin.vue";
import GreenButton from "@/components/GreenButton.vue";
import RoundsPageHeader from "@/components/RoundsPageHeader.vue";
import LoadingState from "@/components/LoadingState.vue";
import ErrorState from "@/components/ErrorState.vue";
import NoRoundsBlock from "@/components/NoRoundsBlock.vue";
import { roundsAPI } from "@/core/api";
import type { RoundWithStatus } from "@shared/types";

const isCreateNewRoundPending = ref(false);
const createButtonTitle = computed(() =>
  isCreateNewRoundPending.value ? "Создание..." : "Создать раунд",
);

const createNewRound = () => {
  isCreateNewRoundPending.value = true;

  setTimeout(() => {
    isCreateNewRoundPending.value = false;
  }, 2000);
};

const isLoading = ref(true);
const isSuccess = ref(false);
const error = ref(false);
const rounds = ref<RoundWithStatus[]>([]);
const hasRounds = computed(() => rounds.value.length > 0);
onMounted(() => {
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
            <div class="text-white" v-for="round in rounds" :key="round.id">
              {{ round.id }}
            </div>
          </template>
          <NoRoundsBlock v-else />
        </template>
      </div>
    </div>
  </div>
</template>
