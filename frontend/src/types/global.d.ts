import type { QueryClient } from "@tanstack/query-core";

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: QueryClient;
    BUILD_INFO: Record<string, unknown>;
  }
}
