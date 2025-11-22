import type {
  DateFormatValues,
  FormatDateOptions,
  WeekDay,
  WeekNamesRecord
} from './types'

import { padNumber } from './number'
import { isObject, isString } from './typed'

/**
 * Formatting rule mapping that maps format patterns to date value keys
 */
const FORMAT_PATTERNS = new Map<string, keyof DateFormatValues>([
  ['yyyy', 'year'],
  ['MM', 'month'],
  ['dd', 'day'],
  ['HH', 'hours'],
  ['mm', 'minutes'],
  ['ss', 'seconds'],
  ['WK', 'week']
])

/**
 * Converts a week names record object to a Map for efficient lookups
 *
 * @param {WeekNamesRecord} names - An object mapping week day numbers (0-6) to their names
 *
 */
function toWeekMap(names: WeekNamesRecord): Map<WeekDay, string> {
  return new Map(
    (Object.entries(names) as [string, string][]).map(([k, v]) => [
      Number(k) as WeekDay,
      v
    ])
  )
}

/**
 * Chinese week names mapping (0 = '日' to 6 = '六')
 */
const WEEK_NAMES_ZH = toWeekMap({
  0: '日',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六'
})

/**
 * English week names mapping (0 = 'Sunday' to 6 = 'Saturday')
 */
const WEEK_NAMES_EN = toWeekMap({
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday'
})

/**
 * Returns the appropriate week names map based on the provided option
 *
 * @param {FormatDateOptions['weekNames']} wk - The week names option ('zh', 'en', or a custom WeekNamesRecord)
 *
 */
function returnWeekNames(
  wk: FormatDateOptions['weekNames']
): Map<WeekDay, string> {
  if (wk === 'zh') return WEEK_NAMES_ZH
  if (wk === 'en') return WEEK_NAMES_EN
  if (isObject(wk)) return toWeekMap(wk)

  return WEEK_NAMES_ZH
}

/**
 * Creates a date format values object containing all date components
 *
 * @param {Date} date - The Date object to extract values from
 * @param {Map<WeekDay, string>} weekNames - The week names map to use for the week value
 *
 */
function createDateValues(
  date: Date,
  weekNames: Map<WeekDay, string>
): DateFormatValues {
  const dayOfWeek = date.getDay() as WeekDay

  return {
    year: date.getFullYear().toString(),
    month: padNumber(date.getMonth() + 1),
    day: padNumber(date.getDate()),
    hours: padNumber(date.getHours()),
    minutes: padNumber(date.getMinutes()),
    seconds: padNumber(date.getSeconds()),
    week: weekNames.get(dayOfWeek) || '',
    weekNum: dayOfWeek
  }
}

/**
 * Formats a date according to the specified format string and returns a formatted string
 *
 * @param {string | number | Date} date - The date to format (string, timestamp, or Date object)
 * @param {string} format - The format template string
 * @param {FormatDateOptions} [options] - Optional configuration for formatting
 * @returns {string} The formatted date string
 */
export function formatDate(
  date: string | number | Date,
  format: string,
  options?: FormatDateOptions
): string

/**
 * Returns the raw date values object when format is null or undefined
 *
 * @param {string | number | Date} date - The date to format (string, timestamp, or Date object)
 * @param {null | undefined} format - Pass null or undefined to return the values object
 * @param {FormatDateOptions} [options] - Optional configuration for formatting
 * @returns {DateFormatValues} An object containing all date component values
 */
export function formatDate(
  date: string | number | Date,
  format: null | undefined,
  options?: FormatDateOptions
): DateFormatValues

/**
 * Formats a date with optional format string (defaults to 'yyyy-MM-dd HH:mm:ss')
 *
 * @param {string | number | Date} date - The date to format (string, timestamp, or Date object)
 * @param {string} [format] - The format template string (optional)
 * @param {FormatDateOptions} [options] - Optional configuration for formatting
 * @returns {string} The formatted date string
 */
export function formatDate(
  date: string | number | Date,
  format?: string,
  options?: FormatDateOptions
): string

/**
 * Formats a date according to a specified format template or returns date component values.
 * Supports custom week names in Chinese, English, or custom formats.
 *
 * @param {string | number | Date} date - The date to format. Can be:
 *   - A date string (e.g., '2024-03-15', '2024-03-15T10:30:00')
 *   - A numeric timestamp (milliseconds since Unix epoch)
 *   - A Date object
 * @param {string | null} [format] - The format template string. Available patterns:
 *   - 'yyyy': Four-digit year
 *   - 'MM': Two-digit month (01-12)
 *   - 'dd': Two-digit day (01-31)
 *   - 'HH': Two-digit hours (00-23)
 *   - 'mm': Two-digit minutes (00-59)
 *   - 'ss': Two-digit seconds (00-59)
 *   - 'WK': Week day name (depends on weekNames option)
 *   Pass null, undefined, or empty string to return the DateFormatValues object instead
 * @param {FormatDateOptions} [options] - Optional configuration object
 * @param {('zh' | 'en' | WeekNamesRecord)} [options.weekNames] - Week names localization:
 *   - 'zh': Chinese week names (日, 一, 二, 三, 四, 五, 六)
 *   - 'en': English week names (Sunday, Monday, etc.)
 *   - Custom object mapping 0-6 to custom week names
 * @returns {string | DateFormatValues} Either:
 *   - A formatted date string (when format is provided)
 *   - A DateFormatValues object with individual date components (when format is null/undefined/empty)
 *
 */
export function formatDate(
  date: string | number | Date,
  format: string | null = 'yyyy-MM-dd HH:mm:ss',
  options?: FormatDateOptions
): string | DateFormatValues {
  if (!date) return new Date().toISOString()

  const { weekNames = 'zh' } = options || {}
  const dateObj = new Date(date || new Date())
  const dateValues = createDateValues(dateObj, returnWeekNames(weekNames))

  if ((isString(format) && !format.trim()) || !format) {
    return dateValues
  }

  let formattedString = format
  FORMAT_PATTERNS.forEach((key, pattern) => {
    const value = dateValues[key]
    formattedString = formattedString.replace(
      new RegExp(pattern, 'g'),
      String(value)
    )
  })

  return formattedString
}
