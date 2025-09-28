// Default max age is 7 days
const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7

/**
 * Get a cookie by name
 * @param name - The name of the cookie
 * @returns The cookie value or undefined if not found
 */
export function getCookie(name: string): string | undefined {
  const cookies = document.cookie.split('; ')
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`))
  if (!cookie) return undefined
  return cookie.split('=')[1]
}

/**
 * Set a cookie
 * @param name - The name of the cookie
 * @param value - The value of the cookie
 * @param maxAge - The max age of the cookie in seconds (default: 7 days)
 */
export function setCookie(
  name: string,
  value: string,
  maxAge: number = DEFAULT_MAX_AGE
): void {
  document.cookie = `${name}=${value}; max-age=${maxAge}; path=/; SameSite=Lax`
}

/**
 * Remove a cookie
 * @param name - The name of the cookie
 */
export function removeCookie(name: string): void {
  document.cookie = `${name}=; max-age=0; path=/; SameSite=Lax`
}