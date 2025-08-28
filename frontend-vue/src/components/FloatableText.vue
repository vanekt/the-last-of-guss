<script setup lang="ts">
import { onMounted, ref } from "vue";

interface Props {
  label: string;
  accent: boolean;
  x: number;
  y: number;
}

interface Emits {
  (e: "finish"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const el = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!el.value) {
    return;
  }

  const animation = el.value.animate(
    [
      {
        opacity: 1,
        transform: `translate(-50%, -50%) scale(${props.accent ? 2 : 1})`,
      },
      {
        opacity: 0,
        transform: `translate(-50%, -200px) scale(${props.accent ? 3 : 1.5})`,
      },
    ],
    {
      duration: 2000,
      easing: "ease-out",
      fill: "forwards",
    },
  );

  animation.onfinish = () => emit("finish");
});
</script>

<template>
  <div
    ref="el"
    class="pointer-events-none absolute text-2xl font-bold"
    :class="accent ? 'text-green-500' : 'text-white'"
    :style="{
      left: x + 'px',
      top: y + 'px',
      transform: 'translate(-50%, -50%)',
    }"
  >
    {{ label }}
  </div>
</template>
