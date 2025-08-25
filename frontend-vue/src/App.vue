<script setup lang="ts">
import { Toaster } from "@steveyuowo/vue-hot-toast";
import AuthGuard from "@/components/AuthGuard.vue";
import "@steveyuowo/vue-hot-toast/vue-hot-toast.css";
</script>

<template>
  <AuthGuard>
    <RouterView />
  </AuthGuard>

  <Toaster />
</template>
