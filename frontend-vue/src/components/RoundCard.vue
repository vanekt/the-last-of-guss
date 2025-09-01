<script setup lang="ts">
import { computed, toRefs } from "vue";
import { Clock } from "lucide-vue-next";
import { formatDate, formatTime } from "@shared/frontend/helpers/rounds";
import { getStatusInfo } from "@/utils/getStatusInfo";
import { useRoundTimer } from "@/composables/useRoundTimer";
import type { RoundWithStatus } from "@shared/types";

interface Props {
  round: RoundWithStatus;
}

interface Emits {
  (e: "timeout"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { round } = toRefs(props);
const status = computed(() => round.value.status.value);
const statusInfo = computed(() => getStatusInfo(round.value.status.value));
const startTime = computed(() => formatDate(round.value.startTime));
const endTime = computed(() => formatDate(round.value.endTime));

const initTimeLeft = computed(() => round.value.status.timer);
const isTimerDisabled = computed(() => status.value === "finished");
const { timeLeft } = useRoundTimer({
  initTimeLeft,
  disabled: isTimerDisabled,
  onTimeout: () => {
    emit("timeout");
  },
});

const shouldDisplayTimer = computed(
  () => timeLeft.value > 0 && status.value !== "finished",
);
</script>

<template>
  <div
    :class="[
      'cursor-pointer rounded-xl border border-white/20 p-6',
      'bg-white/10 backdrop-blur-lg hover:border-purple-400/50 hover:shadow-2xl',
      'transform transition-all',
    ]"
  >
    <div class="flex items-start justify-between">
      <div class="w-full max-w-full space-y-2">
        <div class="flex items-center space-x-3">
          <div
            :class="[
              'hidden h-3 w-3 shrink-0 rounded-full sm:inline',
              statusInfo.bgColorAlt,
            ]"
          ></div>
          <h3
            class="flex max-w-full flex-col gap-0 font-mono text-sm text-white sm:flex-row sm:gap-2"
          >
            <span>Round ID:</span>
            <span class="truncate">{{ round.id }}</span>
          </h3>
        </div>
        <div class="space-y-1 text-sm text-gray-300">
          <div>
            <span class="text-gray-400">Start:</span>
            {{ startTime }}
          </div>
          <div>
            <span class="text-gray-400">End:</span>
            {{ endTime }}
          </div>
        </div>
        <div class="my-4 border-t border-white/10"></div>
        <div class="flex items-center justify-between">
          <div
            :class="[
              'flex items-center space-x-2 rounded-full px-3 py-1',
              statusInfo.bgColor,
            ]"
          >
            <component
              :is="statusInfo.icon"
              :class="['h-4 w-4', statusInfo.color]"
            />
            <span :class="['text-sm font-medium', statusInfo.color]">
              Статус: {{ statusInfo.title }}
            </span>
          </div>
          <div v-if="shouldDisplayTimer" class="flex space-x-2 text-purple-400">
            <Clock class="h-5 w-5" />
            <span class="font-mono text-sm">{{ formatTime(timeLeft) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
