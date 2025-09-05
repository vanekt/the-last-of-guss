<script setup lang="ts">
import { Ellipsis } from "lucide-vue-next";
import type { RoundWinner } from "@shared/types";

interface Props {
  isReady: boolean;
  totalTaps: number;
  totalScore: number;
  winner?: RoundWinner | null;
}

defineProps<Props>();
</script>

<template>
  <div class="space-y-4 border-t border-white/10 pt-4">
    <h3 class="text-lg font-semibold text-white">Статистика раунда</h3>
    <div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
      <div class="rounded-lg bg-white/5 p-3">
        <div class="text-gray-400">Всего тапов</div>
        <div class="text-xl font-bold text-white">
          {{ totalTaps }}
        </div>
      </div>
      <div class="rounded-lg bg-white/5 p-3">
        <div class="text-gray-400">Всего очков</div>
        <div class="text-xl font-bold text-white">
          {{ totalScore }}
        </div>
      </div>
      <div class="rounded-lg bg-white/5 p-3">
        <div class="text-gray-400">Победитель</div>
        <div v-if="isReady" class="text-lg font-bold text-yellow-400">
          {{ winner ? `${winner.username} (${winner.score})` : "Нет" }}
        </div>
        <Ellipsis
          v-else
          class="inline h-7 w-7 animate-ping text-white opacity-50"
        />
      </div>
    </div>
  </div>
</template>
