<script setup lang="ts">
import { watch } from "vue";
import LoadingState from "@/components/LoadingState.vue";
import LoginView from "@/views/LoginView.vue";
import { useAuthStore } from "@/store/authStore";
import { useVerifyQuery } from "@/queries/auth";

const authStore = useAuthStore();
const { data, isLoading } = useVerifyQuery(!!authStore.token);

watch(data, () => {
  if (data.value?.user) {
    authStore.setUser(data.value.user);
  }
});
</script>

<template>
  <LoadingState v-if="isLoading" />
  <template v-else>
    <slot v-if="!!authStore.user" />
    <LoginView v-else />
  </template>
</template>
