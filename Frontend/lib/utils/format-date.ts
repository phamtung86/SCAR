export function formatDateToVietnamTime(isoString: string): string {
  const date = new Date(isoString);
  // Cộng thêm 7 giờ để về múi giờ Việt Nam (UTC+7)
  date.setHours(date.getHours() + 7);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
