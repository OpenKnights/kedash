import type {
  DateFormatValues,
  FormatDateOptions,
  WeekDay,
  WeekNamesRecord
} from './types'
import { padNumber } from './number'
import { isObject, isString } from './typed'

// Formatting rule mapping
const FORMAT_PATTERNS = new Map<string, keyof DateFormatValues>([
  ['yyyy', 'year'],
  ['MM', 'month'],
  ['dd', 'day'],
  ['HH', 'hours'],
  ['mm', 'minutes'],
  ['ss', 'seconds'],
  ['WK', 'week']
])

// Weekly Map
function toWeekMap(names: WeekNamesRecord): Map<WeekDay, string> {
  return new Map(
    (Object.entries(names) as [string, string][]).map(([k, v]) => [
      Number(k) as WeekDay,
      v
    ])
  )
}

const WEEK_NAMES_ZH = toWeekMap({
  0: '日',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六'
})

const WEEK_NAMES_EN = toWeekMap({
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday'
})

function returnWeekNames(
  wk: FormatDateOptions['weekNames']
): Map<WeekDay, string> {
  if (wk === 'zh') return WEEK_NAMES_ZH
  if (wk === 'en') return WEEK_NAMES_EN
  if (isObject(wk)) return toWeekMap(wk)

  return WEEK_NAMES_ZH
}

/**
 * Create a date format value object
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

export function formatDate(
  date: string | number | Date,
  format: string,
  options?: FormatDateOptions
): string

export function formatDate(
  date: string | number | Date,
  format: null | undefined,
  options?: FormatDateOptions
): DateFormatValues

export function formatDate(
  date: string | number | Date,
  format?: string,
  options?: FormatDateOptions
): string

/**
 * Formatting Dates
 * @param date - The date to be formatted (can be a string, a numeric timestamp, or a Date object)
 * @param format - The formatting template, default is 'yyyy-MM-dd HH:mm:ss'
 *                 Passing an empty string returns the formatted value object
 * @returns Formatted string or formatted value object
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
