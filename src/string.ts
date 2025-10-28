import type { CaseTypeTuple } from './types'
import { isString } from './typed'

/**
 * Inserts a string at a specified position in the source string.
 * Supports negative indices (counting from the end) similar to Array.slice().
 *
 * @param {string} source - The original string
 * @param {number} position - The position where the text should be inserted.
 * @param {string} text - The text to insert
 *
 */
export function insertAt(
  source: string,
  position: number,
  text: string
): string {
  // Handle negative indices (like Array.slice)
  const normalizedPosition =
    position < 0
      ? Math.max(0, source.length + position)
      : Math.min(position, source.length)

  return (
    source.slice(0, normalizedPosition) +
    text +
    source.slice(normalizedPosition)
  )
}

/**
 * Transforms string case with custom separators and capitalization rules.
 * Powerful utility for converting between different case conventions (camelCase, PascalCase, snake_case, etc.).
 *
 * @param {string} source - The source string to transform
 * @param {[string, string]} [separators] - A tuple of [inputSeparator, outputSeparator].
 * @param {CaseTypeTuple} [caseRules] - A tuple of [firstWordCase, otherWordsCase].
 *
 */
export function transformCase(
  source: string,
  separators: [string, string] = [' ', ''],
  caseRules: CaseTypeTuple = ['upper', 'lower']
): string {
  if (!isString(source) || !source.trim()) return source

  const [inputSeparator, outputSeparator] = separators
  const [firstWordCase, otherWordsCase] = caseRules

  // Split the string by the input separator
  const words = source.split(inputSeparator)

  // Apply capitalization rules to each word
  const transformedWords = words.map((word, index) => {
    if (!word) return word

    const caseType = index === 0 ? firstWordCase : otherWordsCase
    const firstChar =
      caseType === 'upper' ? word[0].toUpperCase() : word[0].toLowerCase()

    return firstChar + word.slice(1).toLowerCase()
  })

  // Join with the output separator
  return transformedWords.join(outputSeparator)
}
