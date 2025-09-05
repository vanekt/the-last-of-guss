import type { RoundStatusValue, RoundStatusInfo } from "@shared/types";

export function getStatusInfo(status: RoundStatusValue): RoundStatusInfo {
  switch (status) {
    case "active":
      return {
        title: "Активен",
        titleAlt: "Раунд активен!",
        color: "text-green-400",
        bgColor: "bg-green-500/20",
        bgColorAlt: "bg-green-500",
      };
    case "pending":
      return {
        title: "Cooldown",
        titleAlt: "Раунд скоро начнётся...",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/20",
        bgColorAlt: "bg-yellow-500",
      };
    case "finished":
      return {
        title: "Завершён",
        titleAlt: "Раунд завершён",
        color: "text-gray-400",
        bgColor: "bg-gray-500/20",
        bgColorAlt: "bg-gray-500",
      };
    default:
      throw new Error("Wrong status");
  }
}
