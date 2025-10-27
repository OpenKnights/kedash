import type {
  GetQueryParamsOptions,
  ParseOptions,
  Recordable,
  SetQueryParamsOptions,
  TimerControl
} from './types'

import { iterate } from './array'

// ==================== Timer ====================

/**
 * Creates a serial interval executor
 *
 * Difference from setInterval:
 * - setInterval: Triggers every X milliseconds (regardless of whether the previous execution is complete)
 * - setSerialInterval: Waits for the previous execution to complete, then waits X milliseconds before executing the next one
 *
 * @param execute - The function to execute on each interval
 * @param delay - Delay in milliseconds between executions (default: 0)
 * @param immediate - Whether to execute immediately before the first delay (default: false)
 * @returns A TimerControl object with a cancel method
 *
 * @example
 * ```typescript
 * const timer = setSerialInterval(async () => {
 *   await fetchData()
 * }, 5000)
 *
 * // Cancel when needed
 * timer.cancel()
 * ```
 */
export function setSerialInterval(
  execute: (...args: any[]) => any,
  delay: number = 0,
  immediate: boolean = false
): TimerControl {
  let timerId: ReturnType<typeof setTimeout> | null = null
  let isCancelled = false

  const scheduleNext = async () => {
    // If already cancelled, do not schedule next execution
    if (isCancelled) return

    try {
      await execute()
    } catch (error) {
      // You can choose to handle errors here, or let them continue to throw
      console.error('Timer execution error:', error)
    }

    // After execution, if not cancelled, schedule the next execution
    if (!isCancelled) {
      timerId = setTimeout(scheduleNext, delay)
    }
  }

  // Execute immediately if needed
  if (immediate) {
    scheduleNext()
  } else {
    // Schedule the first execution
    timerId = setTimeout(scheduleNext, delay)
  }

  return {
    cancel: () => {
      isCancelled = true
      if (timerId !== null) {
        clearTimeout(timerId)
        timerId = null
      }
    }
  }
}

// ==================== Random ====================

/**
 * Generates a random integer between min and max (inclusive)
 *
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (inclusive)
 * @returns A random integer between min and max
 *
 * @example
 * ```typescript
 * random(1, 10) // Returns a number between 1 and 10
 * random(0, 100) // Returns a number between 0 and 100
 * ```
 */
export const random = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Generates a unique identifier string with specified length
 *
 * @param length - The length of the generated ID
 * @param specials - Optional special characters to include in the character set (default: '')
 * @returns A randomly generated string ID
 *
 * @example
 * ```typescript
 * uid(10) // Returns: "aBc123XyZ4"
 * uid(8, '!@#') // Returns: "aB3!@cD#"
 * ```
 */
export const uid = (length: number, specials: string = ''): string => {
  const characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789${specials}`
  return iterate(
    length,
    (acc) => {
      return acc + characters.charAt(random(0, characters.length - 1))
    },
    ''
  )
}

// ==================== URL ====================

/**
 * Transforms an object into URL query string parameters
 *
 * Supports nested objects with bracket notation (e.g., filter[name]=value)
 * Automatically encodes keys and values for URL safety
 * Skips null, undefined, and empty string values
 *
 * @param params - The parameters object to transform
 * @returns URL-encoded query string (without leading '?')
 *
 * @example
 * ```typescript
 * // Simple parameters
 * toQueryString({ name: 'John', age: 25 })
 * // Returns: 'name=John&age=25'
 *
 * // Nested object parameters
 * toQueryString({ filter: { status: 'active', type: 'user' }, page: 1 })
 * // Returns: 'filter[status]=active&filter[type]=user&page=1'
 *
 * // Skips empty values
 * toQueryString({ name: 'John', email: null, phone: '' })
 * // Returns: 'name=John'
 * ```
 */
export function toQueryString(params: Recordable): string {
  const pairs: string[] = []

  for (const [key, value] of Object.entries(params)) {
    // Skip null, undefined, and empty strings
    if (value == null || value === '') continue

    // Handle nested objects
    if (typeof value === 'object' && !Array.isArray(value)) {
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        // Skip empty nested values
        if (nestedValue == null || nestedValue === '') continue

        const encodedKey = encodeURIComponent(`${key}[${nestedKey}]`)
        const encodedValue = encodeURIComponent(String(nestedValue))
        pairs.push(`${encodedKey}=${encodedValue}`)
      }
    } else {
      // Handle primitive values and arrays
      const encodedKey = encodeURIComponent(key)
      const encodedValue = encodeURIComponent(String(value))
      pairs.push(`${encodedKey}=${encodedValue}`)
    }
  }

  return pairs.join('&')
}

/**
 * Gets query parameters from URL
 *
 * @param keys - Array of parameter keys to retrieve
 * @param options - Configuration options
 * @returns Object containing the requested parameters
 *
 * @example
 * ```typescript
 * // Get from current URL
 * getQueryParams(['page', 'filter'])
 * // Returns: { page: '2', filter: 'active' }
 *
 * // Get from custom URL
 * getQueryParams(
 *   ['id'],
 *   { url: 'https://example.com?id=123&type=post' }
 * )
 * // Returns: { id: '123' }
 *
 * // Get all query params
 * getQueryParams(
 *   [],
 *   { url: 'https://example.com?id=123&type=post', all: true }
 * )
 * // Returns: { id: '123', type: 'post' }
 *
 * // URL without params (automatically adds ?)
 * getQueryParams(['id'], { url: 'https://example.com' })
 * // Returns: { id: undefined }
 * ```
 */
export function getQueryParams(
  keys: string[],
  options: GetQueryParamsOptions = {}
): Recordable<string | undefined> {
  const { url, all = false } = options
  let params = {} as Recordable<string | undefined>

  if (!all && (!keys || !Array.isArray(keys) || keys.length === 0)) {
    console.error(
      `[GetQueryParams Error]: keys must be a non-empty array of strings`
    )
    return params
  }

  let searchParams: URLSearchParams

  if (url) {
    try {
      // Parse custom URL
      const urlObj = new URL(url)
      searchParams = new URLSearchParams(urlObj.search)
    } catch {
      console.error(`[GetQueryParams Error]: Invalid URL provided - ${url}`)
      return params
    }
  } else {
    // Use current window location
    searchParams = new URLSearchParams(window.location.search)
  }

  if (all) {
    const searchKeys = [...searchParams.keys()]
    if (searchKeys.length < 1) return params

    searchParams.forEach((value, key) => {
      params[key] = value ?? undefined
    })
  } else {
    params = keys.reduce(
      (res, key) => {
        const param = searchParams.get(key)
        res[key] = param ?? undefined
        return res
      },
      {} as Recordable<string | undefined>
    )
  }

  return params
}

/**
 * Sets or updates query parameters in URL
 *
 * @param params - Object containing parameters to set or update
 * @param options - Configuration options
 * @returns The modified URL string (if custom URL provided), or void (if modifying window.location)
 *
 * @example
 * ```typescript
 * // Modify current URL
 * setQueryParams({ page: 2, filter: 'active' })
 * // Current URL becomes: ?page=2&filter=active
 *
 * // Return modified custom URL
 * const newUrl = setQueryParams(
 *   { page: 2, filter: 'active' },
 *   { url: 'https://example.com/path' }
 * )
 * // Returns: 'https://example.com/path?page=2&filter=active'
 *
 * // URL with existing params
 * const newUrl = setQueryParams(
 *   { page: 3 },
 *   { url: 'https://example.com?page=1&filter=all' }
 * )
 * // Returns: 'https://example.com?page=3&filter=all'
 *
 * // Custom skip logic
 * setQueryParams(
 *   { tags: [], status: null },
 *   {
 *     skipNull: false,
 *     skipIf: (key, value) => Array.isArray(value) && value.length === 0
 *   }
 * )
 * ```
 */
export function setQueryParams(
  params: Recordable,
  options: SetQueryParamsOptions = {}
): string | void {
  if (!params || params?.constructor !== Object) {
    console.error(`[SetQueryParams Error]: params must be an object`)
    return
  }

  const keys = Object.entries(params)
  if (keys.length === 0) {
    console.error(`[SetQueryParams Error]: params must be a non-empty object`)
    return
  }

  const {
    url,
    skipIf,
    skipNull = false,
    skipUndefined = false,
    skipEmptyString = false,
    trimStrings = false
  } = options

  let searchParams: URLSearchParams
  let baseUrl: string
  let hash: string = ''

  if (url) {
    try {
      const urlObj = new URL(url)
      searchParams = new URLSearchParams(urlObj.search)
      baseUrl = `${urlObj.origin}${urlObj.pathname}`
      hash = urlObj.hash
    } catch {
      console.error(`[SetQueryParams Error]: Invalid URL provided - ${url}`)
      return
    }
  } else {
    searchParams = new URLSearchParams(window.location.search)
    baseUrl = window.location.pathname
    hash = window.location.hash
  }

  // Helper function to check if value should be skipped
  const shouldSkipValue = (key: string, value: any): boolean => {
    // Check built-in skip conditions
    if (skipNull && value === null) return true
    if (skipUndefined && value === undefined) return true

    if (skipEmptyString && typeof value === 'string') {
      const stringValue = trimStrings ? value.trim() : value
      if (!stringValue) return true
    }

    // Check custom skip function
    if (skipIf && skipIf(key, value)) return true

    return false
  }

  // Update search params
  for (const [param, value] of keys) {
    if (shouldSkipValue(param, value)) {
      continue
    }

    searchParams.set(param, String(value))
  }

  const queryString = searchParams.toString()
  const newUrl = queryString
    ? `${baseUrl}?${queryString}${hash}`
    : `${baseUrl}${hash}`

  // If custom URL provided, return the modified URL
  if (url) {
    return newUrl
  }

  // Otherwise, update window location
  window.history.replaceState({}, '', newUrl)
}

// ==================== JSON ====================

/**
 * Attempts to parse a JSON string with fallback value
 *
 * @template T - The expected type of the parsed result
 * @param str - The JSON string to parse
 * @param fallback - The fallback value if parsing fails (default: null)
 * @param options - Parsing options including validator and error callback
 * @returns The parsed result, or fallback value
 *
 * @example
 * ```typescript
 * // Basic usage
 * const data = tryParse<User>('{"name":"John"}', {})
 *
 * // With validation
 * const withValidation = tryParse('{"id":1}', null, {
 *   validator: (val): val is User => typeof val.id === 'number'
 * })
 *
 * // With error handling
 * tryParse('invalid json', {}, {
 *   onError: (error, input) => console.log('Parse failed:', error)
 * })
 * ```
 */
export function tryParse<T = any>(
  str: string,
  fallback: T | null = null,
  options: ParseOptions<T> = {}
): T | null {
  const { validator, onError } = options

  try {
    const result = JSON.parse(str)

    // Validate result if validator is provided
    if (validator && !validator(result)) {
      const error = new Error('Parsed result failed validation')
      if (onError) onError(error, str)
      return fallback
    }

    return result
  } catch (error) {
    if (onError) {
      onError(error as Error, str)
    }
    return fallback
  }
}
