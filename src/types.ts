// ==================== helper ====================

export type Recordable<T = any> = Record<string, T>

// ==================== array ====================

export type SortType = 'ASC' | 'DESC'

// ==================== curry ====================

export interface ThrottleOptions {
  leading?: boolean
  trailing?: boolean
}

// ==================== object ====================

/**
 * Custom transformer function type for value conversion
 */
export type ValueTransformer = (value: any, key: string) => any

/**
 * Options for value coercion
 */
export interface TransformOptions {
  /** Deep coerce nested objects and arrays */
  deep?: boolean
  /** Custom value transformer */
  transformer?: ValueTransformer
  /** Convert numeric strings to numbers */
  parseNumbers?: boolean
  /** Convert date strings to Date objects */
  parseDates?: boolean
  /** Specific keys to coerce (if not provided, coerces all) */
  keys?: string[]
  /** Convert empty strings to null */
  emptyStringToNull?: boolean
  /** Convert special numeric values (NaN, Infinity) */
  parseSpecialNumbers?: boolean
}

// ==================== string ====================

export type CaseType = 'upper' | 'lower'
export type CaseTypeTuple = [CaseType, CaseType]

// ==================== typed ====================

export type CommonType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'array'
  | 'object'
  | 'function'
  | 'null'
  | 'undefined'
  | 'date'
  | 'regexp'
  | 'map'
  | 'set'
  | 'weakmap'
  | 'weakset'
  | 'promise'
  | 'error'
  | 'symbol'
  | 'bigint'

// ==================== date ====================

export interface DateFormatValues {
  year: string
  month: string
  day: string
  hours: string
  minutes: string
  seconds: string
  week: string
  weekNum: number
}

type weekNamesType = 'zh' | 'en'

export interface FormatDateOptions {
  weekNames?: WeekNamesRecord | weekNamesType
}

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6
export type WeekNamesRecord = Record<WeekDay, string>

// ==================== timer ====================

export interface TimerControl {
  cancel: () => void
}

// ==================== url ====================

type SkipIfFn = (key: string, value: any) => boolean

export interface GetQueryParamsOptions {
  /**
   * Custom URL to modify (if not provided, uses current window.location)
   */
  url?: string

  /**
   * Get all query parameters in the URL
   */
  all?: boolean
}

export interface SetQueryParamsOptions {
  /**
   * Custom URL to modify (if not provided, uses current window.location)
   */
  url?: string

  /**
   * Function to determine if a parameter should be skipped
   * Return true to skip, false to include
   */
  skipIf?: SkipIfFn

  /**
   * Whether to skip null values
   * @default true
   */
  skipNull?: boolean

  /**
   * Whether to skip undefined values
   * @default true
   */
  skipUndefined?: boolean

  /**
   * Whether to skip empty strings
   * @default true
   */
  skipEmptyString?: boolean

  /**
   * Whether to trim string values before checking if empty
   * @default true
   */
  trimStrings?: boolean
}

// ==================== json ====================

/**
 * Options for JSON parsing
 */
export interface ParseOptions<T = any> {
  /** Validation function to ensure parsed result matches expected format */
  validator?: (value: any) => value is T
  /** Error callback for handling parse failures */
  onError?: (error: Error, input: string) => void
}

/**
 * Options for JSON stringification
 */
export interface StringifyOptions {
  /** Custom replacer function for value transformation */
  replacer?: (key: string, value: any) => any
  /** Indentation for pretty printing (number of spaces or string) */
  space?: string | number
  /** Error callback for handling stringify failures */
  onError?: (error: Error, input: any) => void
}
