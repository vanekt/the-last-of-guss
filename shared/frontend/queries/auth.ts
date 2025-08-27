import type { VerifyFn } from "@shared/frontend/core/api";

export const getVerifyQueryOptions = (
  verifyFn: VerifyFn,
  enabled: boolean
) => ({
  queryKey: ["user"],
  queryFn: verifyFn,
  enabled,
  retry: false,
});
