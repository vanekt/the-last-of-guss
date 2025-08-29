<script setup lang="ts">
import UserMenu from "./UserMenu.vue";
</script>

<template>
  <div class="flex justify-between">
    <slot />
    <UserMenu />
  </div>
</template>
