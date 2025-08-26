<script setup lang="ts">
import { useAuthStore } from "@/store/authStore";

const authStore = useAuthStore();
</script>

<template>
  <slot v-if="authStore.userRole === 'admin'" />
</template>
