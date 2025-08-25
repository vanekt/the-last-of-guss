<script setup lang="ts">
import UserMenu from "./UserMenu.vue";
</script>

<template>
  <div
    className="flex flex-col space-y-12 justify-between items-end sm:flex-row-reverse"
  >
    <UserMenu />

    <div class="space-y-2 self-start">
      <h1 class="text-4xl font-bold text-white">The Last of Guss</h1>
      <p class="text-gray-300">Выберите раунд для участия</p>
    </div>
  </div>
</template>
