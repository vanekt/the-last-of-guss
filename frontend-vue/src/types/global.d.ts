import type { QueryClient } from "@tanstack/query-core";
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: QueryClient;
    BUILD_INFO: {
      branch: string;
      buildTime: string;
      commitHash: string;
      commitDate: string;
    };
  }
}
