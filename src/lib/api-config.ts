const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

if (!configuredApiBaseUrl) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL must be configured before making API requests.",
  );
}

export const API_BASE_URL = configuredApiBaseUrl.replace(/\/+$/, "");
