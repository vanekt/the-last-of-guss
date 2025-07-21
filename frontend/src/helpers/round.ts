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

export function formatTime(value?: number) {
  if (!value) {
    return "";
  }

  const MS_PER_SECOND = 1000;
  const MS_PER_MINUTE = 60 * MS_PER_SECOND;
  const MS_PER_HOUR = 60 * MS_PER_MINUTE;

  const hours = Math.floor(value / MS_PER_HOUR);
  const minutes = Math.floor((value % MS_PER_HOUR) / MS_PER_MINUTE);
  const seconds = Math.floor((value % MS_PER_MINUTE) / MS_PER_SECOND);

  const padZero = (num: number) => num.toString().padStart(2, "0");

  if (hours > 0) {
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
  }

  return `${padZero(minutes)}:${padZero(seconds)}`;
}
