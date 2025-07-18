import { Play, Clock, CheckCircle } from "lucide-react";
import type { RoundStatusValue } from "@shared/types";

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function getStatusInfo(status: RoundStatusValue) {
  switch (status) {
    case "active":
      return {
        title: "Активен",
        titleAlt: "Раунд активен!",
        color: "text-green-400",
        bgColor: "bg-green-500/20",
        icon: Play,
      };
    case "pending":
      return {
        title: "Cooldown",
        titleAlt: "Раунд скоро начнётся...",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/20",
        icon: Clock,
      };
    case "finished":
      return {
        title: "Завершен",
        titleAlt: "Раунд завершен",
        color: "text-gray-400",
        bgColor: "bg-gray-500/20",
        icon: CheckCircle,
      };
    default:
      return {
        text: "Неизвестно",
        color: "text-gray-400",
        bgColor: "bg-gray-500/20",
        icon: Clock,
      };
  }
}

export function formatTimeRemaining(timeRemaining?: number) {
  if (!timeRemaining) {
    return "";
  }

  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}
