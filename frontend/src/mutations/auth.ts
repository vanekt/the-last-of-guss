import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LoginRequest, LoginResponse } from "@shared/types";
import { authAPI } from "@/core/api";
import { tokenAtom, userAtom } from "@/store/authAtoms";

export const useLoginMutation = (
  onSuccess?: (data: LoginResponse) => void,
  onError?: (error: Error) => void
) => {
  const setToken = useSetAtom(tokenAtom);
  const setUser = useSetAtom(userAtom);

  return useMutation({
    mutationFn: async (data: LoginRequest): Promise<LoginResponse> => {
      return authAPI.login(data);
    },
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user);
      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(error);
    },
  });
};

export const useLogoutMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  const resetToken = useResetAtom(tokenAtom);

  return useMutation({
    mutationFn: async () => {
      return Promise.resolve();
    },
    onSuccess: () => {
      resetToken();
      queryClient.clear();
      onSuccess?.();
    },
  });
};
