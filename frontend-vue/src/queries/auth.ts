import { useQuery } from "@tanstack/vue-query";
import { authAPI } from "@/core/api";

export const useVerifyQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ["user"],
    queryFn: authAPI.verify,
    enabled,
    retry: false,
  });
};
