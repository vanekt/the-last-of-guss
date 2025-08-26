import { createAPI } from "@shared/frontend/core/api";
import { useAuthStore } from "@/store/authStore";

export const { authAPI, roundsAPI } = createAPI(
  import.meta.env.VITE_BACKEND_URL,
  () => useAuthStore().token,
  () => useAuthStore().resetToken(),
);
