import { getApiBaseUrl } from "@/lib/api-config";
import { getAccessToken } from "@/lib/storage";
import type { DashboardSummary } from "./types";

export async function getDashboardSummary(
  signal?: AbortSignal,
): Promise<DashboardSummary> {
  const token = getAccessToken();
  if (!token) throw new Error("Your session has expired. Please sign in again.");

  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}/dashboard/summary`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    throw new Error(
      "Cannot connect to the dashboard server. Check that the backend is running.",
    );
  }

  const text = await response.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    data = undefined;
  }

  if (!response.ok) {
    const serverMessage =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : undefined;
    throw new Error(serverMessage ?? `Dashboard request failed (${response.status}).`);
  }

  return data as DashboardSummary;
}
