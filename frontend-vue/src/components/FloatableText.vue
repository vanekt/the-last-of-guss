<script setup lang="ts">
interface Props {
  accent: boolean;
  label: string;
  x: number;
  y: number;
}

export interface Floatable extends Props {
  key: number;
}

interface Emits {
  (e: "finish"): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <Transition appear name="floatable" @after-enter="emit('finish')">
    <div
      class="pointer-events-none absolute text-2xl font-bold"
      :class="accent ? 'text-green-500' : 'text-white'"
      :style="{
        left: x + 'px',
        top: y + 'px',
        '--from-scale': accent ? '2' : '1',
        '--to-scale': accent ? '3' : '1.5',
      }"
    >
      {{ label }}
    </div>
  </Transition>
</template>

<style scoped>
.floatable-enter-active {
  transition:
    transform 2s ease-out,
    opacity 2s ease-out;
}

.floatable-enter-from {
  opacity: 1;
  transform: translate(-50%, -50%) scale(var(--from-scale));
}

.floatable-enter-to {
  opacity: 0;
  transform: translate(-50%, -200px) scale(var(--to-scale));
}
</style>
