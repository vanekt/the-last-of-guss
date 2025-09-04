<script setup lang="ts">
import { ref } from "vue";
import { useElementBounding, useTimeout } from "@vueuse/core";
import FloatableText, { type Floatable } from "@/components/FloatableText.vue";

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

const floatables = ref<Floatable[]>([]);

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

const buttonEl = ref<HTMLElement | null>(null);
const { left, top } = useElementBounding(buttonEl);

const { isPending: isScaling, start: startScaling } = useTimeout(100, {
  controls: true,
  immediate: false,
});

const { isPending: isSpinning, start: startSpinning } = useTimeout(500, {
  controls: true,
  immediate: false,
});

function handleClick(e: MouseEvent) {
  emit("click");

  startScaling();

  if (props.accent) {
    startSpinning();
  }

  createFloatable(e.clientX - left.value, e.clientY - top.value);
}
</script>

<template>
  <div class="relative inline-block select-none">
    <button
      ref="buttonEl"
      :disabled="props.disabled"
      :class="[
        'text-9xl transition-transform duration-100',
        isScaling && 'scale-125',
        isSpinning && 'spin-goose',
        props.disabled && 'opacity-50',
        props.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
      ]"
      @click="handleClick"
    >
      🪿
    </button>

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
    transform: rotate(360deg);
  }
}

.spin-goose {
  animation: spin 0.5s ease-out;
}
</style>
