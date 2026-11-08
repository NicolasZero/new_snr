const SESSION_KEY = "snr-authenticated"

export async function authenticate(
  username: string,
  password: string,
): Promise<boolean> {
  await new Promise((resolve) => window.setTimeout(resolve, 350))

  const isValidCredentials = username === "admin" && password === "admin"

  if (isValidCredentials) {
    window.localStorage.setItem(SESSION_KEY, "true")
  }

  return isValidCredentials
}

export function hasAuthenticatedSession(): boolean {
  return window.localStorage.getItem(SESSION_KEY) === "true"
}

export function clearAuthenticatedSession(): void {
  window.localStorage.removeItem(SESSION_KEY)
}
