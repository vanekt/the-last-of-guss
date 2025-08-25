<script setup lang="ts">
import { useAuthStore } from "@/store/authStore";

const authStore = useAuthStore();
const isAdmin = authStore.userRole === "admin";
</script>

<template>
  <slot v-if="isAdmin"></slot>
</template>
