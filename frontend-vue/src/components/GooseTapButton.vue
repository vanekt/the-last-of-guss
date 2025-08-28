<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
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

const tapButtonRef = ref<HTMLElement | null>(null);
const rect = ref<DOMRect | null>(null);

function updateRect() {
  if (tapButtonRef.value) {
    rect.value = tapButtonRef.value.getBoundingClientRect();
  }
}

onMounted(() => {
  updateRect();
  window.addEventListener("resize", updateRect);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateRect);
});

function handleClick(e: MouseEvent) {
  if (props.disabled) {
    return;
  }

  emit("click");

  isScaling.value = true;
  setTimeout(() => (isScaling.value = false), 100);

  if (props.accent) {
    isSpinning.value = true;
    setTimeout(() => (isSpinning.value = false), 700);
  }

  if (rect.value) {
    createFloatable(e.clientX - rect.value.left, e.clientY - rect.value.top);
  }
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
      ref="tapButtonRef"
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
    <template v-for="floatable in floatables" :key="floatable.key">
      <FloatableText
        :label="floatable.label"
        :accent="floatable.accent"
        :x="floatable.x"
        :y="floatable.y"
        @finish="() => handleFloatableFinish(floatable.key)"
      />
    </template>
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
