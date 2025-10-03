import { useEffect, useState } from 'react'

/**
 * Hook that delays updating a value until after a specified delay.
 * Useful for search inputs to avoid excessive API calls.
 * @params value The value to debounce
 * @params delay Delay in milliseconds (default 500ms)
 * @returns Debounced value
 * 
 * @Example
 * 
 */
// Search 'abc', without debounce, call API 3 times ('a', 'ab', 'abc')
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
