const JWT_STORAGE_KEY = "auth_token";

export async function authFetch(
  url: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem(JWT_STORAGE_KEY);

  const headers = new Headers(options.headers || {});

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
}