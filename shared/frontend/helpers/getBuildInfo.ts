import { getCmdOutput } from "./getCmdOutput";

export function getBuildInfo() {
  return {
    "import.meta.env.VITE_BUILD_TIME": JSON.stringify(new Date().toISOString()),
    "import.meta.env.VITE_BRANCH_NAME": JSON.stringify(
      getCmdOutput("git rev-parse --abbrev-ref HEAD")
    ),
    "import.meta.env.VITE_COMMIT_HASH": JSON.stringify(
      getCmdOutput("git rev-parse HEAD")
    ),
    "import.meta.env.VITE_COMMIT_DATE": JSON.stringify(
      getCmdOutput("git log -1 --format=%cd --date=iso")
    ),
  };
}
