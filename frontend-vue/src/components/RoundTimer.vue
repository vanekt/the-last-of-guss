<script setup lang="ts">
import { Clock } from "lucide-vue-next";
import { formatTime } from "@shared/frontend/helpers/rounds";

interface Props {
  value: number;
}

defineProps<Props>();
</script>

<template>
  <div class="flex items-center justify-center space-x-2 text-purple-200">
    <Clock class="h-5 w-5" />
    <span class="font-mono text-xl">{{ formatTime(value) }}</span>
  </div>
</template>
