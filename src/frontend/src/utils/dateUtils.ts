export function timeAgo(dateStrOrTimestamp: string | number): string {
  const timestamp =
    typeof dateStrOrTimestamp === "string"
      ? new Date(dateStrOrTimestamp).getTime()
      : dateStrOrTimestamp;
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}
