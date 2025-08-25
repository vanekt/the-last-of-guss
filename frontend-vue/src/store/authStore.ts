import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { UserPayload } from "@shared/types";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const token = ref<string | null>();

    function setToken(value: string) {
      token.value = value;
    }

    function resetToken() {
      token.value = null;
    }

    const user = ref<UserPayload | null>();
    const userRole = computed(() => user.value?.role);

    function setUser(u: UserPayload | null) {
      user.value = u;
    }

    return { token, setToken, resetToken, user, setUser, userRole };
  },
  {
    persist: {
      storage: localStorage,
      pick: ["token"],
    },
  },
);
