<script setup lang="ts">
import { useRouter } from "vue-router";
import { User, LogOut } from "lucide-vue-next";
import { useAuthStore } from "@/store/authStore";

const router = useRouter();
const authStore = useAuthStore();
</script>

<template>
  <div class="flex items-center space-x-4">
    <div class="flex items-center space-x-2 text-white">
      <User class="h-5 w-5" />
      <span class="font-medium">{{ authStore.user?.role }}</span>
      <span class="rounded-full bg-purple-600 px-2 py-1 text-xs">
        {{ authStore.userRole }}
      </span>
    </div>
    <button
      @click="router.replace('/logout')"
      class="cursor-pointer p-2 text-gray-400 transition-colors hover:text-white"
      title="Выйти"
    >
      <LogOut class="h-5 w-5" />
    </button>
  </div>
</template>
