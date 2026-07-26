import { createAPI } from "@shared/frontend/core/api";
import { store } from "@/core/jotaiStore";
import { tokenAtom, resetTokenAtom } from "@/store/authAtoms";

export const { authAPI, roundsAPI } = createAPI(
  window.__ENV__.BACKEND_URL,
  () => {
    return store.get(tokenAtom);
  },
  () => {
    store.set(resetTokenAtom);
  },
);
