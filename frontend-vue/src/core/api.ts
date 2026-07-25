import { createAPI } from "@shared/frontend/core/api";
import { useAuthStore } from "@/store/authStore";

export const { authAPI, roundsAPI } = createAPI(
  window.__ENV__.BACKEND_URL,
  () => useAuthStore().token,
  () => useAuthStore().resetToken(),
);
