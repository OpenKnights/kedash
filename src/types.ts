/* array */
export type SortType = 'ASC' | 'DESC'

/* string */
export type CaseType = 'upper' | 'lower'
export type CaseTypeTuple = [CaseType, CaseType]

/* typed */
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

/* date */
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

/* timer */
export interface TimerControl {
  cancel: () => void
}

/* helper */
export type Recordable<T = any> = Record<string, T>

/* json */
/**
 * Custom transformer function type for value conversion
 */
export type ValueTransformer = (value: any, key: string) => any

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

/**
 * Options for value coercion
 */
export interface CoerceOptions {
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
