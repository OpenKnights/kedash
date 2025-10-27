import type { TransformOptions, ValueTransformer } from './types'
import { isArray, isObject, isPrimitive, isSymbol, isType } from './typed'

/**
 * Creates a shallow copy of the given obejct/value.
 * @param {*} obj value to shallowClone
 * @returns {*} shallow clone of the given value
 */
export const shallowClone = <T>(obj: T): T => {
  // Primitive values do not need cloning.
  if (isPrimitive(obj)) {
    return obj
  }

  // Binding a function to an empty object creates a
  // copy function.
  if (typeof obj === 'function') {
    return obj.bind({})
  }

  // Access the constructor and create a new object.
  // This method can create an array as well.
  const newObj = new ((obj as object).constructor as { new (): T })()

  // Assign the props.
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    // Bypass type checking since the primitive cases
    // are already checked in the beginning
    ;(newObj as any)[prop] = (obj as any)[prop]
  })

  return newObj
}

/**
 * Deep clones a value, supporting complex types like objects, arrays, Map, and Set
 *
 * @template T - The type of the value to be cloned
 * @param {T} source - The source value to clone
 * @param {WeakMap<object, any>} [hash] - Hash map for handling circular references
 * @returns {T} The cloned new value
 */
export function deepClone<T>(source: T, hash = new WeakMap<object, any>()): T {
  // Handle circular references
  if (hash.has(source as object)) {
    return hash.get(source as object)
  }

  // Handle Symbol
  if (isSymbol(source)) {
    return Symbol((source as symbol).description) as T
  }

  // Handle primitive types
  if (isPrimitive(source)) {
    return source
  }

  // Handle Set
  if (isType('set', source)) {
    const newSet = new Set()
    hash.set(source as object, newSet)
    ;(source as Set<any>).forEach((value) => {
      newSet.add(deepClone(value, hash))
    })
    return newSet as T
  }

  // Handle Map
  if (isType('map', source)) {
    const newMap = new Map()
    hash.set(source as object, newMap)
    ;(source as Map<any, any>).forEach((value, key) => {
      const clonedKey = isPrimitive(key) ? key : deepClone(key, hash)
      newMap.set(clonedKey, deepClone(value, hash))
    })
    return newMap as T
  }

  // Handle arrays and objects
  const isArr = isArray(source)
  const cloneObject: any = isArr ? [] : {}
  hash.set(source as object, cloneObject)

  if (isArr) {
    ;(source as any[]).forEach((item, index) => {
      cloneObject[index] = deepClone(item, hash)
    })
  } else {
    // Clone string key properties
    Object.keys(source as object).forEach((key) => {
      cloneObject[key] = deepClone((source as any)[key], hash)
    })
    // Clone Symbol key properties
    Object.getOwnPropertySymbols(source as object).forEach((sym) => {
      cloneObject[sym] = deepClone((source as any)[sym], hash)
    })
  }

  return cloneObject as T
}

/**
 * Transforms string values in objects to their appropriate types.
 * Handles nested objects and arrays when deep option is enabled.
 *
 * @param {Input} data - The data to transform (can be object, array, or primitive)
 * @param {TransformOptions} [options] - Configuration options for transformation behavior
 *
 */
export function transformObjectValues<Input = any, Output = Input>(
  data: Input,
  options: TransformOptions = {}
): Output {
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
    return data as unknown as Output
  }

  // Handle primitive types
  if (!isObject(data) && !isArray(data)) {
    return data as Output
  }

  // Handle arrays
  if (Array.isArray(data)) {
    if (!deep) return data as Output
    return data.map((item) => transformObjectValues(item, options)) as Output
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
   * Transforms a single value to its appropriate type or format
   */
  const transformValue = (val: any, key: string): any => {
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
      return transformObjectValues(val, options)
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

    result[key] = transformValue(value, key)
  }

  return result as Output
}

/**
 * Creates a custom value transformer with predefined rules
 *
 * @param rules - Map of key patterns to transformation functions
 *
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
