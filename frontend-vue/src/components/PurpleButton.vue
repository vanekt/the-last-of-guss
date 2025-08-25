<script setup lang="ts">
import { useAttrs } from "vue";

const { title } = defineProps<{ title: string }>();
const attrs = useAttrs();
</script>

<template>
  <button
    :class="[
      'w-full rounded-lg px-4 py-3 font-semibold',
      'transform transition-all',
      'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
      'hover:scale-105 hover:cursor-pointer hover:from-purple-700 hover:to-pink-700',
      'focus:ring-2 focus:ring-purple-500 focus:outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',
    ]"
    v-bind="attrs"
  >
    <span>{{ title }}</span>
  </button>
</template>
