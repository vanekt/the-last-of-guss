<script setup lang="ts">
import { defineProps } from "vue";
import { Trophy, Target } from "lucide-vue-next";

interface Props {
  taps: number;
  score: number;
}

defineProps<Props>();
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div class="rounded-lg bg-white/5 p-4">
      <div class="flex items-center justify-center space-x-2 text-blue-400">
        <Target class="h-5 w-5" />
        <span class="font-medium">Мои тапы</span>
      </div>
      <div class="text-2xl font-bold text-white">{{ taps }}</div>
    </div>
    <div class="rounded-lg bg-white/5 p-4">
      <div class="flex items-center justify-center space-x-2 text-purple-400">
        <Trophy class="h-5 w-5" />
        <span class="font-medium">Мои очки</span>
      </div>
      <div class="text-2xl font-bold text-white">{{ score }}</div>
    </div>
  </div>
</template>
