import { execSync } from "node:child_process";

export function getCmdOutput(cmd: string) {
  return execSync(cmd).toString().trim();
}
