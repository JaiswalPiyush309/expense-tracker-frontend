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

export interface SaveCategoryInput {
  name: string;
  type: CategoryType;
}

function authHeaders(): HeadersInit {
  const token = getAccessToken();
  if (!token) throw new Error("Your session has expired. Please sign in again.");
  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(authHeaders());
  if (init.body) headers.set("Content-Type", "application/json");
  new Headers(init.headers).forEach((value, key) => headers.set(key, value));

  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...init,
      headers,
    });
  } catch {
    throw new Error(
      "Cannot connect to the category server. Check that the backend is running.",
    );
  }

  const body: unknown = await response.json().catch(() => undefined);
  if (!response.ok) {
    const message =
      typeof body === "object" && body !== null && "message" in body
        ? Array.isArray(body.message)
          ? body.message.join(" ")
          : String(body.message)
        : `Category request failed (${response.status}).`;
    throw new Error(message);
  }
  return body as T;
}

export async function getCategoryOptions(
  type: CategoryType,
): Promise<CategoryOption[]> {
  return request<CategoryOption[]>(`/categories/options?type=${type}`);
}

export async function saveCategory(
  input: SaveCategoryInput,
  id?: string,
): Promise<void> {
  await request<unknown>(id ? `/categories/${encodeURIComponent(id)}` : "/categories", {
    method: id ? "PATCH" : "POST",
    body: JSON.stringify(input),
  });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("categories:changed"));
  }
}

export async function deleteCategory(id: string): Promise<void> {
  await request<unknown>(`/categories/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("categories:changed"));
  }
}
