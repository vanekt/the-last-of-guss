<script setup lang="ts">
import type { RoundStatusValue } from "@shared/types";
import { getStatusInfo } from "@/utils/getStatusInfo";

interface Props {
  status: RoundStatusValue;
}

const props = defineProps<Props>();
</script>

<template>
  <h2 :class="['text-2xl font-bold', getStatusInfo(props.status).color]">
    {{ getStatusInfo(status).titleAlt }}
  </h2>
</template>
