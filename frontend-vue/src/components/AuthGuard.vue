<script setup lang="ts">
import { watch } from "vue";
import LoadingState from "@/components/LoadingState.vue";
import LoginPage from "@/pages/LoginPage.vue";
import { useAuthStore } from "@/store/authStore";
import { useVerifyQuery } from "@/queries/auth";

const authStore = useAuthStore();
const { data, isLoading } = useVerifyQuery(!!authStore.token);

watch(
  data,
  () => {
    authStore.setUser(data.value?.user || null);
  },
  { immediate: true },
);
</script>

<template>
  <LoadingState v-if="isLoading" />
  <template v-else>
    <slot v-if="!!authStore.user" />
    <LoginPage v-else />
  </template>
</template>
