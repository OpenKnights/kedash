import type {
  CoerceOptions,
  ParseOptions,
  Recordable,
  StringifyOptions,
  TimerControl,
  ValueTransformer
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
 * Retrieves specific query parameters from the current URL
 *
 * @template T - String union type of the expected parameter keys
 * @param keys - Array of parameter keys to retrieve
 * @returns An object containing the requested parameters with their values (or undefined if not found)
 *
 * @example
 * ```typescript
 * // URL: https://example.com?name=John&age=25
 * getQueryParams(['name', 'age'])
 * // Returns: { name: 'John', age: '25' }
 *
 * // Missing parameters return undefined
 * getQueryParams(['name', 'email'])
 * // Returns: { name: 'John', email: undefined }
 * ```
 */
export function getQueryParams<T extends string>(
  keys: T[]
): Recordable<string | undefined> {
  if (!keys || !Array.isArray(keys) || keys.length === 0) {
    console.error(
      `[GetQueryParams Error]: keys must be a non-empty array of strings`
    )
    return {} as Recordable<string | undefined>
  }

  const searchParams = new URLSearchParams(window.location.search)
  const params = keys.reduce(
    (res, key) => {
      const param = searchParams.get(key)

      if (param) {
        res[key] = param
      } else {
        res[key] = undefined
      }

      return res
    },
    {} as Recordable<string | undefined>
  )

  return params
}

/**
 * Sets or updates query parameters in the current URL without page reload
 *
 * Uses history.replaceState to update the URL
 * Skips null, undefined, and empty string values
 *
 * @param params - An object containing the parameters to set or update
 *
 * @example
 * ```typescript
 * // Set multiple parameters
 * setQueryParams({ page: 2, filter: 'active' })
 * // URL becomes: ?page=2&filter=active
 *
 * // Update existing parameters
 * setQueryParams({ page: 3 })
 * // URL becomes: ?page=3&filter=active
 *
 * // Empty values are skipped
 * setQueryParams({ page: 3, filter: null })
 * // URL becomes: ?page=3
 * ```
 */
export function setQueryParams(params: Recordable): void {
  if (!params || params?.constructor !== Object) {
    console.error(`[SetQueryParams Error]: params must be an object`)
    return
  }

  const keys = Object.entries(params)
  if (keys.length === 0) {
    console.error(`[SetQueryParams Error]: params must be a non-empty object`)
    return
  }

  const searchParams = new URLSearchParams(window.location.search)
  for (const [param, value] of keys) {
    if (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && !value.trim())
    ) {
      continue
    }

    searchParams.set(param, String(value))
  }

  const queryString = searchParams.toString()
  const newUrl = queryString ? `?${queryString}` : window.location.pathname

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
 *
 * // Chain with coerceValues
 * const normalized = coerceValues(tryParse('{"active":"true"}'))
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

/**
 * Safely stringifies a value to JSON with error handling
 *
 * @param value - The value to stringify
 * @param fallback - The fallback string if stringification fails (default: "{}")
 * @param options - Stringification options including replacer, space, and error callback
 * @returns The JSON string or fallback value
 *
 * @example
 * ```typescript
 * // Basic usage
 * const json = tryStringify({ name: "John" })
 *
 * // Pretty print with indentation
 * const pretty = tryStringify(data, "{}", { space: 2 })
 *
 * // With custom replacer
 * tryStringify(data, "{}", {
 *   replacer: (key, value) => typeof value === 'function' ? undefined : value
 * })
 *
 * // With error handling
 * tryStringify(circularRef, "{}", {
 *   onError: (error) => console.log('Stringify failed:', error)
 * })
 * ```
 */
export function tryStringify(
  value: any,
  fallback: string = '{}',
  options: StringifyOptions = {}
): string {
  const { replacer, space, onError } = options

  try {
    return JSON.stringify(value, replacer, space)
  } catch (error) {
    if (onError) {
      onError(error as Error, value)
    }
    return fallback
  }
}

/**
 * Coerces string values to their appropriate types
 * Handles nested objects and arrays when deep option is enabled
 *
 * @template T - The expected type of the result
 * @param data - The data to coerce (object, array, or primitive)
 * @param options - Coercion options for customizing the conversion behavior
 * @returns The coerced data with converted values
 *
 * @example
 * ```typescript
 * // Basic boolean and null conversion
 * coerceValues({ active: "true", value: "null" })
 * // Returns: { active: true, value: null }
 *
 * // With number parsing
 * coerceValues({ count: "42", price: "3.14" }, { parseNumbers: true })
 * // Returns: { count: 42, price: 3.14 }
 *
 * // Deep coercion
 * coerceValues({ user: { active: "false", age: "25" } }, {
 *   deep: true,
 *   parseNumbers: true
 * })
 * // Returns: { user: { active: false, age: 25 } }
 *
 * // With date parsing
 * coerceValues({ createdAt: "2024-01-01" }, { parseDates: true })
 * // Returns: { createdAt: Date(2024-01-01) }
 *
 * // With custom transformer
 * coerceValues({ status: "ACTIVE" }, {
 *   transformer: (val) => typeof val === 'string' ? val.toLowerCase() : val
 * })
 * // Returns: { status: "active" }
 *
 * // Specific keys only
 * coerceValues({
 *   active: "true",
 *   name: "true"
 * }, { keys: ["active"] })
 * // Returns: { active: true, name: "true" }
 *
 * // Chain with tryParse for JSON strings in data
 * const data = { config: '{"theme":"dark"}' }
 * const parsed = coerceValues(data, {
 *   transformer: (val, key) => {
 *     if (key === 'config' && typeof val === 'string') {
 *       return tryParse(val, val)
 *     }
 *     return val
 *   }
 * })
 * ```
 */
export function coerceValues<T = any>(data: T, options: CoerceOptions = {}): T {
  const {
    deep = false,
    transformer,
    parseNumbers = false,
    parseDates = false,
    keys,
    emptyStringToNull = false,
    parseSpecialNumbers = false
  } = options

  // Handle null and undefined
  if (data === null || data === undefined) {
    return data
  }

  // Handle primitive types
  if (typeof data !== 'object') {
    return data
  }

  // Handle arrays
  if (Array.isArray(data)) {
    if (!deep) return data
    return data.map((item) => coerceValues(item, options)) as T
  }

  // Simple value map for common string representations
  const simpleMap: Record<string, any> = {
    true: true,
    false: false,
    null: null,
    undefined
  }

  // Special numeric values
  if (parseSpecialNumbers) {
    simpleMap.NaN = Number.NaN
    simpleMap.Infinity = Infinity
    simpleMap['-Infinity'] = -Infinity
  }

  /**
   * ISO 8601 date regex pattern
   * Matches: YYYY-MM-DD, YYYY-MM-DDTHH:mm:ss, YYYY-MM-DDTHH:mm:ss.sssZ
   */
  const ISO_DATE_PATTERN =
    /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/

  /**
   * Numeric string pattern (including negative and decimal)
   */
  const NUMERIC_PATTERN = /^-?\d+(\.\d+)?$/

  /**
   * Coerces a single value to its appropriate type
   */
  const coerceValue = (val: any, key: string): any => {
    // Apply custom transformer first if provided
    if (transformer) {
      const transformed = transformer(val, key)
      if (transformed !== val) return transformed
    }

    // Handle string values
    if (typeof val === 'string') {
      // Handle empty strings
      if (emptyStringToNull && val === '') {
        return null
      }

      // Check simple value map (true, false, null, undefined, etc.)
      if (val in simpleMap) {
        return simpleMap[val]
      }

      // Parse dates if enabled
      if (parseDates && ISO_DATE_PATTERN.test(val)) {
        const date = new Date(val)
        if (!Number.isNaN(date.getTime())) {
          return date
        }
      }

      // Parse numbers if enabled
      if (parseNumbers && NUMERIC_PATTERN.test(val)) {
        const num = Number(val)
        if (!Number.isNaN(num)) return num
      }

      return val
    }

    // Recursively handle nested objects/arrays in deep mode
    if (deep && val !== null && typeof val === 'object') {
      return coerceValues(val, options)
    }

    return val
  }

  // Process object entries efficiently
  const result: Record<string, any> = {}

  for (const [key, value] of Object.entries(data as Record<string, any>)) {
    // Skip keys not in the allowed list if keys option is provided
    if (keys && !keys.includes(key)) {
      result[key] = value
      continue
    }

    result[key] = coerceValue(value, key)
  }

  return result as T
}

/**
 * Creates a custom value transformer with predefined rules
 *
 * @param rules - Map of key patterns to transformation functions
 * @returns A transformer function that can be used with coerceValues
 *
 * @example
 * ```typescript
 * // Basic transformer
 * const transformer = createTransformer({
 *   'date': (val) => val.match(/^\d{4}-\d{2}-\d{2}$/) ? new Date(val) : val,
 *   'price': (val) => typeof val === 'string' ? parseFloat(val) : val
 * })
 *
 * // Wildcard transformer (applies to all keys)
 * const trimTransformer = createTransformer({
 *   '*': (val) => typeof val === 'string' ? val.trim() : val
 * })
 *
 * // Use with coerceValues
 * coerceValues(data, { transformer })
 * ```
 */
export function createTransformer(
  rules: Record<string, (value: any) => any>
): ValueTransformer {
  return (value: any, key: string) => {
    // Check specific key patterns first
    for (const [pattern, transform] of Object.entries(rules)) {
      if (pattern === '*') continue // Skip wildcard for now

      if (key.includes(pattern)) {
        const transformed = transform(value)
        if (transformed !== value) return transformed
      }
    }

    // Apply wildcard rule if exists
    if (rules['*']) {
      return rules['*'](value)
    }

    return value
  }
}
