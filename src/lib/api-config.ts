const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

export function getApiBaseUrl(): string {
  if (!configuredApiBaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL must be configured before making API requests.",
    );
  }

  return configuredApiBaseUrl.replace(/\/+$/, "");
}
