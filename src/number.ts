/**
 * Safely converts to float with default value.
 *
 * @template T - The type of the default value (number or null)
 * @param {any} value - The value to convert to a float
 * @param {T} [defaultValue] - The default value to return if conversion fails. Defaults to 0.0 if not specified
 *
 */
export const toFloat = <T extends number | null = number>(
  value: any,
  defaultValue?: T
): number | T => {
  const def = defaultValue === undefined ? 0.0 : defaultValue
  if (value === null || value === undefined) {
    return def
  }
  const result = Number.parseFloat(value)
  return Number.isNaN(result) ? def : result
}

/**
 * Safely converts to integer with default value.
 *
 * @template T - The type of the default value (number or null)
 * @param {any} value - The value to convert to an integer
 * @param {T} [defaultValue] - The default value to return if conversion fails. Defaults to 0 if not specified
 *
 */
export const toInt = <T extends number | null = number>(
  value: any,
  defaultValue?: T
): number | T => {
  const def = defaultValue === undefined ? 0 : defaultValue
  if (value === null || value === undefined) {
    return def
  }
  const result = Number.parseInt(value)
  return Number.isNaN(result) ? def : result
}

/**
 * Pads a number to at least two digits by adding leading zeros if necessary.
 * Commonly used for formatting time components (hours, minutes, seconds) or dates.
 *
 * @param {number} value - The number to pad
 *
 */
export function padNumber(value: number): string {
  return value.toString().padStart(2, '0')
}
