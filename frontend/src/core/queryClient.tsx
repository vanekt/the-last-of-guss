import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();
window.__TANSTACK_QUERY_CLIENT__ = queryClient;
