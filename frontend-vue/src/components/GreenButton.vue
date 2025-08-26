<script setup lang="ts">
import { useAttrs } from "vue";

interface Props {
  title: string;
}

const props = defineProps<Props>();
const attrs = useAttrs();
</script>

<template>
  <button
    :class="[
      'flex cursor-pointer items-center space-x-2 rounded-lg px-6 py-3 font-semibold',
      'transform transition-all',
      'bg-gradient-to-r from-green-600 to-emerald-600 text-white',
      'hover:scale-105 hover:from-green-700 hover:to-emerald-700',
      'focus:ring-2 focus:ring-green-500 focus:outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',
    ]"
    v-bind="attrs"
  >
    <slot name="icon" />
    <span>{{ props.title }}</span>
  </button>
</template>
