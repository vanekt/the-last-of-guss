<script setup lang="ts">
import { ref, computed } from "vue";
import { Lock, User } from "lucide-vue-next";
import PurpleButton from "@/components/PurpleButton.vue";
import { authAPI } from "@/core/api";
import { useAuthStore } from "@/store/authStore";

const username = ref("");
const password = ref("");
const isPending = ref(false);
const error = ref("");

const buttonTitle = computed(() => (isPending.value ? "Вход..." : "Войти"));
const { setUser, setToken } = useAuthStore();

const handleSubmit = async () => {
  error.value = "";

  if (!username.value.trim() || !password.value.trim()) {
    error.value = "Пожалуйста, заполните все поля";
    return;
  }

  isPending.value = true;

  authAPI
    .login({
      username: username.value,
      password: password.value,
    })
    .then((res) => {
      setToken(res.token);
      setUser(res.user);
      // TODO show success toast
    })
    .catch(() => {
      error.value = "Ошибка входа"; // TODO use toast
    })
    .finally(() => {
      isPending.value = false;
    });
};
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div
        class="space-y-4 p-4 sm:rounded-2xl sm:border sm:border-white/20 sm:bg-white/10 sm:p-8 sm:shadow-2xl sm:backdrop-blur-lg"
      >
        <div class="text-center">
          <h1 class="mb-2 text-3xl font-bold text-white">The Last of Guss</h1>
          <p class="text-gray-300">Войдите, чтобы начать игру</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label
              for="username"
              class="mb-2 block text-sm font-medium text-gray-200"
            >
              Имя пользователя
            </label>
            <div class="relative">
              <User
                class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400"
              />

              <input
                id="username"
                type="text"
                v-model="username"
                class="w-full rounded-lg border border-white/20 bg-white/10 py-3 pr-4 pl-10 text-white placeholder-gray-400 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="Введите имя пользователя"
                :disabled="isPending"
                autofocus
                autocomplete="username"
              />
            </div>
          </div>
          <div>
            <label
              for="password"
              class="mb-2 block text-sm font-medium text-gray-200"
            >
              Пароль
            </label>
            <div class="relative">
              <Lock
                class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400"
              />

              <input
                id="password"
                type="password"
                v-model="password"
                class="w-full rounded-lg border border-white/20 bg-white/10 py-3 pr-4 pl-10 text-white placeholder-gray-400 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="Введите пароль"
                :disabled="isPending"
                autocomplete="current-password"
              />
            </div>
          </div>

          <PurpleButton
            type="submit"
            :title="buttonTitle"
            :disabled="isPending"
          />
        </form>

        <div v-if="error" class="mt-4 text-center text-sm text-red-400">
          {{ error }}
        </div>

        <div class="mt-6 text-center text-sm text-gray-400">
          <p>Если аккаунта нет, он будет создан автоматически</p>
        </div>
      </div>
    </div>
  </div>
</template>
