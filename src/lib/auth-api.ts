const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001"
).replace(/\/+$/, "");

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
}

export interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
}

export interface AuthResponse {
  message?: string;
  token?: string;
  accessToken?: string;
  access_token?: string;
  id?: string;
  name?: string;
  email?: string;
  user?: AuthUser;
}

export function getAuthUser(response: AuthResponse): AuthUser | undefined {
  if (response.user) return response.user;
  if (response.id && response.email) return response;
  return undefined;
}

async function postAuth<T>(
  endpoint: string,
  body: LoginRequest | RegisterRequest,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(
      "Cannot connect to the authentication server. Check that the backend is running and the API URL is correct.",
    );
  }

  const responseText = await response.text();
  let data: unknown;

  try {
    data = responseText ? JSON.parse(responseText) : undefined;
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
    const message =
      response.status >= 500
        ? "The authentication service is temporarily unavailable. Please try again."
        : (serverMessage ??
          (response.status === 401
            ? "Invalid email or password."
            : `Authentication failed (${response.status}).`));

    throw new Error(message);
  }

  return data as T;
}

export function loginUser(request: LoginRequest) {
  return postAuth<AuthResponse>("login", request);
}

export function registerUser(request: RegisterRequest) {
  return postAuth<AuthResponse>("register", request);
}

export function getAccessTokenFromResponse(
  response: AuthResponse,
): string | undefined {
  const token = response.access_token ?? response.accessToken ?? response.token;

  return typeof token === "string" && token.trim() ? token.trim() : undefined;
}
