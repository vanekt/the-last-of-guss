<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { Plus } from "lucide-vue-next";
import { toast } from "@steveyuowo/vue-hot-toast";
import { useAuthStore } from "@/store/authStore";
import ErrorState from "@/components/ErrorState.vue";
import GreenButton from "@/components/GreenButton.vue";
import LoadingState from "@/components/LoadingState.vue";
import NoRoundsBlock from "@/components/NoRoundsBlock.vue";
import PageContainer from "@/components/PageContainer.vue";
import RoundCard from "@/components/RoundCard.vue";
import RoundsPageHeader from "@/components/RoundsPageHeader.vue";
import { useRoundsQuery } from "@/queries/rounds";
import { useCreateRoundMutation } from "@/mutations/rounds";
import { RouteNames } from "@/constants";

const router = useRouter();
const { isAdmin } = storeToRefs(useAuthStore());
const { data: rounds, error, isLoading, isSuccess, refetch } = useRoundsQuery();

const createMutation = useCreateRoundMutation(
  (data) => {
    toast.success("Раунд создан!");
    router.push({ name: RouteNames.Round, params: { id: data.id } });
  },
  () => {
    toast.error("Ошибка создания раунда");
  },
);

const createButtonTitle = computed(() =>
  createMutation.isPending.value ? "Создание..." : "Создать раунд",
);

const hasRounds = computed(
  () => Array.isArray(rounds.value) && rounds.value.length > 0,
);
</script>

<template>
  <PageContainer>
    <RoundsPageHeader />

    <div class="space-y-6">
      <GreenButton
        v-if="isAdmin"
        v-bind="{
          title: createButtonTitle,
          disabled: createMutation.isPending.value,
        }"
        @click="createMutation.mutate"
      >
        <template #icon>
          <Plus class="h-5 w-5" />
        </template>
      </GreenButton>

      <LoadingState v-if="isLoading" />

      <ErrorState v-if="error" />

      <template v-if="isSuccess">
        <template v-if="hasRounds">
          <p class="font-bold text-gray-300">Выберите раунд для участия:</p>

          <RouterLink
            v-for="round in rounds"
            :key="round.id"
            v-bind="{
              to: { name: RouteNames.Round, params: { id: round.id } },
            }"
            class="block"
          >
            <RoundCard v-bind="{ round }" @timeout="refetch" />
          </RouterLink>
        </template>
        <NoRoundsBlock v-else />
      </template>
    </div>
  </PageContainer>
</template>
