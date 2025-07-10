export function formatMoney(amount: number | string | null | undefined, shorten: boolean = false): string {
  if (amount === null || amount === undefined) return "0 VNĐ";

  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "0 VNĐ";

  if (shorten) {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(2).replace(/\.?0+$/, '') + 'B VNĐ';
    } else if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'M VNĐ';
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(2).replace(/\.?0+$/, '') + 'K VNĐ';
    }
  }

  return num.toLocaleString('vi-VN') + ' VNĐ';
}
