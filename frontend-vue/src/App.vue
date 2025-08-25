<script setup lang="ts">
import AuthGuard from '@/components/AuthGuard.vue';
</script>

<template>
  <AuthGuard>
    <RouterView />
  </AuthGuard>
</template>
