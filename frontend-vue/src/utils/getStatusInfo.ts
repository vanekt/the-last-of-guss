import { Play, Clock, CheckCircle } from "lucide-vue-next";
import type { RoundStatusValue } from "@shared/types";

// TODO move to shared
export function getStatusInfo(status: RoundStatusValue) {
  switch (status) {
    case "active":
      return {
        title: "Активен",
        titleAlt: "Раунд активен!",
        color: "text-green-400",
        bgColor: "bg-green-500/20",
        bgColorAlt: "bg-green-500",
        icon: Play,
      };
    case "pending":
      return {
        title: "Cooldown",
        titleAlt: "Раунд скоро начнётся...",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/20",
        bgColorAlt: "bg-yellow-500",
        icon: Clock,
      };
    case "finished":
      return {
        title: "Завершен",
        titleAlt: "Раунд завершен",
        color: "text-gray-400",
        bgColor: "bg-gray-500/20",
        bgColorAlt: "bg-gray-500",
        icon: CheckCircle,
      };
    default:
      return {
        text: "Неизвестно",
        color: "text-gray-400",
        bgColor: "bg-gray-500/20",
        bgColorAlt: "bg-gray-500",
        icon: Clock,
      };
  }
}
