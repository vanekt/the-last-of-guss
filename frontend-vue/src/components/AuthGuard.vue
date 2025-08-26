<script setup lang="ts">
import { onMounted, ref } from "vue";
import LoadingState from "@/components/LoadingState.vue";
import LoginPage from "@/pages/LoginPage.vue";
import { authAPI } from "@/core/api";
import { useAuthStore } from "@/store/authStore";

const authStore = useAuthStore();
const isLoading = ref(false);

onMounted(() => {
  isLoading.value = true;
  authAPI
    .verify()
    .then((res) => {
      authStore.setUser(res.user);
    })
    .finally(() => {
      isLoading.value = false;
    });
});
</script>

<template>
  <LoadingState v-if="isLoading" />
  <template v-else>
    <slot v-if="!!authStore.user" />
    <LoginPage v-else />
  </template>
</template>
