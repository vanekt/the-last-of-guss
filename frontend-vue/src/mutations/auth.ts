import { useMutation, useQueryClient } from "@tanstack/vue-query";
import type { LoginRequest, LoginResponse } from "@shared/types";
import { authAPI } from "@/core/api";
import { useAuthStore } from "@/store/authStore";

export const useLoginMutation = (
  onSuccess?: (data: LoginResponse) => void,
  onError?: (error: Error) => void,
) => {
  const authStore = useAuthStore();

  return useMutation({
    mutationFn: async (data: LoginRequest): Promise<LoginResponse> => {
      return authAPI.login(data);
    },
    onSuccess: (data) => {
      authStore.setToken(data.token);
      authStore.setUser(data.user);
      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(error);
    },
  });
};

export const useLogoutMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  const authStore = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      return Promise.resolve();
    },
    onSuccess: () => {
      authStore.resetToken();
      authStore.setUser(null);
      queryClient.clear();
      onSuccess?.();
    },
  });
};
