import { atom } from "jotai";
import { atomWithStorage, RESET } from "jotai/utils";
import { atomWithQuery } from "jotai-tanstack-query";
import { queryClient } from "@/core/queryClient";
import { authAPI } from "@/core/api";
import type { UserPayload } from "@shared/types";

export const tokenAtom = atomWithStorage<string | null>(
  "token",
  null,
  undefined,
  {
    getOnInit: true,
  }
);

export const resetTokenAtom = atom(null, (_, set) => {
  set(tokenAtom, RESET);
});

export const verifyAtom = atomWithQuery(
  (get) => ({
    queryKey: ["user"],
    queryFn: authAPI.verify,
    enabled: !!get(tokenAtom),
    retry: false,
  }),
  () => queryClient
);

export const isVerifyLoadingAtom = atom((get) => get(verifyAtom).isLoading);

export const userAtom = atom(
  (get) => {
    const token = get(tokenAtom);
    if (!token) {
      return null;
    }

    return get(verifyAtom).data?.user || null;
  },
  (_, __, newUser: UserPayload | null) => {
    queryClient.setQueryData(["user"], { user: newUser });
  }
);

export const userRoleAtom = atom((get) => get(userAtom)?.role);
