<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import { useElementBounding } from "@vueuse/core";
import FloatableText, { type Floatable } from "./FloatableText.vue";

interface Props {
  accent: boolean;
  floatableLabel: string;
  disabled: boolean;
}

interface Emits {
  (e: "click"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isScaling = ref(false);
const isSpinning = ref(false);
const floatables = ref<Floatable[]>([]);

const el = ref<HTMLElement | null>(null);
const { left, top } = useElementBounding(el);

let scaleTimeout: ReturnType<typeof setTimeout> | null = null;
let spinTimeout: ReturnType<typeof setTimeout> | null = null;

onUnmounted(() => {
  if (scaleTimeout) {
    clearTimeout(scaleTimeout);
  }
  if (spinTimeout) {
    clearTimeout(spinTimeout);
  }
});

function handleClick(e: MouseEvent) {
  if (props.disabled) {
    return;
  }

  emit("click");

  isScaling.value = true;
  if (scaleTimeout) {
    clearTimeout(scaleTimeout);
  }
  scaleTimeout = setTimeout(() => (isScaling.value = false), 100);

  if (props.accent) {
    isSpinning.value = true;
    if (spinTimeout) {
      clearTimeout(spinTimeout);
    }
    spinTimeout = setTimeout(() => (isSpinning.value = false), 500);
  }

  createFloatable(e.clientX - left.value, e.clientY - top.value);
}

function createFloatable(x: number, y: number) {
  floatables.value.push({
    key: Date.now() + Math.random(),
    x,
    y,
    label: props.floatableLabel,
    accent: props.accent,
  });
}

function handleFloatableFinish(id: number) {
  floatables.value = floatables.value.filter((b) => b.key !== id);
}
</script>

<template>
  <div class="relative inline-block select-none">
    <div
      ref="el"
      :class="[
        'inline-flex transition-transform duration-100',
        isScaling && 'scale-125',
        isSpinning && 'spin-goose',
        props.disabled && 'opacity-50',
        props.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
      ]"
      @click="handleClick"
    >
      <div class="text-9xl">🪿</div>
    </div>

    <FloatableText
      v-for="floatable in floatables"
      :key="floatable.key"
      :label="floatable.label"
      :accent="floatable.accent"
      :x="floatable.x"
      :y="floatable.y"
      @finish="() => handleFloatableFinish(floatable.key)"
    />
  </div>
</template>

<style scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spin-goose {
  animation: spin 0.5s ease-in reverse;
}
</style>
