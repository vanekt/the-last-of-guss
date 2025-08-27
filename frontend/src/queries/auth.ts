import { useQuery } from "@tanstack/react-query";
import { authAPI } from "@/core/api";

export const getVerifyQuery = (enabled: boolean) => ({
  queryKey: ["user"],
  queryFn: authAPI.verify,
  enabled,
  retry: false,
});

export const useVerifyQuery = (enabled: boolean) => {
  return useQuery(getVerifyQuery(enabled));
};
