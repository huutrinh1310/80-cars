const ABSOLUTE_URL_PATTERN = /^https?:\/\//i;
const DJANGO_PREFIX = "/djangoapp";
const DJANGO_ORIGIN =
  import.meta.env.VITE_DJANGO_ORIGIN?.replace(/\/$/, "") || "";

export function buildApiUrl(path: string) {
  if (ABSOLUTE_URL_PATTERN.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (DJANGO_ORIGIN && normalizedPath.startsWith(DJANGO_PREFIX)) {
    return `${DJANGO_ORIGIN}${normalizedPath}`;
  }

  return `${window.location.origin}${normalizedPath}`;
}

export async function requestJson<T>(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers,
    credentials: "include",
  });

  const data = (await response.json().catch(() => ({}))) as T & {
    error?: string;
    message?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? data.message ?? "Request failed.");
  }

  return data;
}
