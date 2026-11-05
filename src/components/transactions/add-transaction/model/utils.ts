export function formatINRNumber(
  amount: number,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2,
): string {
  if (Number.isNaN(amount)) return "0.00";
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
}

export function inferMerchantFromTitle(title: string): string | null {
  const normalized = title.toLowerCase();
  if (normalized.includes("swiggy")) return "Swiggy Bundl Technologies Pvt Ltd";
  if (normalized.includes("zomato")) return "Eternal / Zomato Ltd";
  if (normalized.includes("uber")) return "Uber India Systems Pvt Ltd";
  if (normalized.includes("amazon")) return "Amazon Seller Services Pvt Ltd";
  return null;
}
