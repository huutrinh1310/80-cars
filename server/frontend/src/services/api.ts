const ABSOLUTE_URL_PATTERN = /^https?:\/\//i;

export function buildApiUrl(path: string) {
  if (ABSOLUTE_URL_PATTERN.test(path)) {
    return path;
  }

  return `${window.location.origin}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function requestJson<T>(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers,
  });

  const data = (await response.json()) as T;

  if (!response.ok) {
    throw new Error("Request failed.");
  }

  return data;
}