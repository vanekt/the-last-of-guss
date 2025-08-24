import { createAPI } from "@shared/frontend/core/api";
import { store } from "@/core/jotaiStore";
import { tokenAtom, resetTokenAtom } from "@/store/authAtoms";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

console.log("backendUrl", backendUrl);

export const { authAPI, roundsAPI } = createAPI(
  backendUrl,
  () => {
    return store.get(tokenAtom);
  },
  () => {
    store.set(resetTokenAtom);
  }
);
