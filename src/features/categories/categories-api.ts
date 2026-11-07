import { getAccessToken } from "@/lib/storage";
import { getApiBaseUrl } from "@/lib/api-config";

export type CategoryType = "EXPENSE" | "INCOME";

export interface CategoryOption {
  id: string;
  name: string;
  type: CategoryType;
  icon: string | null;
  color: string | null;
  isSystem: boolean;
  isCustom: boolean;
}

export async function getCategoryOptions(type: CategoryType): Promise<CategoryOption[]> {
  const token = getAccessToken();
  if (!token) throw new Error("Your session has expired. Please sign in again.");

  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}/categories/options?type=${type}`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new Error("Cannot connect to the category server. Check that the backend is running.");
  }

  const body: unknown = await response.json().catch(() => undefined);
  if (!response.ok) {
    const message = typeof body === "object" && body !== null && "message" in body
      ? Array.isArray(body.message) ? body.message.join(" ") : String(body.message)
      : `Category request failed (${response.status}).`;
    throw new Error(message);
  }
  return body as CategoryOption[];
}
