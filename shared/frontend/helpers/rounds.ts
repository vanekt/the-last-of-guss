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

export function formatTime(value: number) {
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
