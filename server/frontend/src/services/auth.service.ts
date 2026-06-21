import { requestJson } from "@/services/api";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  userName: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  status?: string | boolean;
  error?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
}

export function persistUserSession(data: Partial<RegisterPayload> & AuthResponse) {
  if (data.userName) {
    sessionStorage.setItem("username", data.userName);
  }

  if (data.firstName) {
    sessionStorage.setItem("firstname", data.firstName);
  }

  if (data.lastName) {
    sessionStorage.setItem("lastname", data.lastName);
  }
}

export async function login({ username, password }: LoginPayload) {
  const data = await requestJson<AuthResponse>("/djangoapp/login", {
    method: "POST",
    body: JSON.stringify({
      userName: username,
      password,
    }),
  });

  if (data.status !== "Authenticated") {
    throw new Error("The user could not be authenticated.");
  }

  persistUserSession(data);
  return data;
}

export async function register(payload: RegisterPayload) {
  const data = await requestJson<AuthResponse>("/djangoapp/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!data.status) {
    throw new Error(data.error ?? "The user could not be registered.");
  }

  persistUserSession({
    ...payload,
    ...data,
  });

  return data;
}

export async function logout() {
  const data = await requestJson<unknown>("/djangoapp/logout", {
    method: "GET",
  });

  sessionStorage.removeItem("username");
  sessionStorage.removeItem("firstname");
  sessionStorage.removeItem("lastname");

  return data;
}
