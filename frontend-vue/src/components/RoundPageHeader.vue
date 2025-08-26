<script setup lang="ts">
import { useRouter } from "vue-router";
import { ArrowLeft } from "lucide-vue-next";
import UserMenu from "./UserMenu.vue";

const router = useRouter();
</script>

<template>
  <div class="flex items-center justify-between">
    <button
      class="flex cursor-pointer items-center space-x-2 text-gray-400 transition-colors hover:text-white"
      @click="router.push('/rounds')"
    >
      <ArrowLeft class="h-5 w-5" />
      <span>Раунды</span>
    </button>

    <UserMenu />
  </div>
</template>
