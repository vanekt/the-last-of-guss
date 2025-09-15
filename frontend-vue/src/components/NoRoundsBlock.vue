<script setup lang="ts">
import { useAuthStore } from "@/store/authStore";
const authStore = useAuthStore();
</script>

<template>
  <div class="py-12 text-center">
    <div class="text-lg text-gray-400">Раундов пока нет</div>
    <p v-if="authStore.isAdmin" class="mt-2 text-gray-500">
      Создайте первый раунд
    </p>
  </div>
</template>
