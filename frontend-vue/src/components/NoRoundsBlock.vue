<script setup lang="ts">
import IfAdmin from "./IfAdmin.vue";
</script>

<template>
  <div class="py-12 text-center">
    <div class="text-lg text-gray-400">Раундов пока нет</div>

    <IfAdmin>
      <p class="mt-2 text-gray-500">Создайте первый раунд</p>
    </IfAdmin>
  </div>
</template>
