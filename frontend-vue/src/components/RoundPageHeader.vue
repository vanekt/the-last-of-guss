<script setup lang="ts">
import { useRouter } from "vue-router";
import { ArrowLeft } from "lucide-vue-next";
import PageHeader from "./PageHeader.vue";
import { RouteNames } from "@/constants";

const router = useRouter();
</script>

<template>
  <PageHeader>
    <button
      class="flex cursor-pointer items-center space-x-2 text-gray-400 transition-colors hover:text-white"
      @click="router.push({ name: RouteNames.Rounds })"
    >
      <ArrowLeft class="h-5 w-5" />
      <span>Раунды</span>
    </button>
  </PageHeader>
</template>
