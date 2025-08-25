<script setup lang="ts">
import { LoaderCircle } from "lucide-vue-next";
</script>

<template>
  <div
    class="pointer-events-none fixed top-0 left-0 flex h-screen w-screen items-center justify-center"
  >
    <LoaderCircle class="h-12 w-12 animate-spin text-white opacity-50" />
  </div>
</template>
