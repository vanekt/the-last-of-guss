<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { Plus } from "lucide-vue-next";
import { toast } from "@steveyuowo/vue-hot-toast";
import IfAdmin from "@/components/IfAdmin.vue";
import GreenButton from "@/components/GreenButton.vue";
import RoundsPageHeader from "@/components/RoundsPageHeader.vue";
import LoadingState from "@/components/LoadingState.vue";
import ErrorState from "@/components/ErrorState.vue";
import NoRoundsBlock from "@/components/NoRoundsBlock.vue";
import RoundCard from "@/components/RoundCard.vue";
import { useRoundsQuery } from "@/queries/rounds";
import { useCreateRoundMutation } from "@/mutations/rounds";

const router = useRouter();

const { data: rounds, error, isLoading, isSuccess, refetch } = useRoundsQuery();

const createMutation = useCreateRoundMutation(
  (data) => {
    toast.success("Раунд создан!");
    router.push(`/rounds/${data.id}`);
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
  <div class="min-h-screen">
    <div class="container mx-auto space-y-12 px-4 py-4 sm:p-8">
      <RoundsPageHeader />

      <div class="space-y-6">
        <IfAdmin>
          <GreenButton
            :title="createButtonTitle"
            :disabled="createMutation.isPending.value"
            @click="createMutation.mutate"
          >
            <template #icon>
              <Plus class="h-5 w-5" />
            </template>
          </GreenButton>
        </IfAdmin>

        <LoadingState v-if="isLoading" />
        <ErrorState v-if="error" />

        <template v-if="isSuccess">
          <template v-if="hasRounds">
            <RoundCard
              v-for="round in rounds"
              :key="round.id"
              :round="round"
              :on-timeout="refetch"
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
