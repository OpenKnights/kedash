import type { SortType } from './types'

/**
 * Sorts an array of items into groups.
 *
 * @template T - The type of items in the array
 * @template Key - The type of the group key (must be string, number, or symbol)
 * @param {readonly T[]} array - The array of items to group
 * @param {(item: T) => Key} getGroupId - Function that returns the group key for each item
 *
 */
export const group = <T, Key extends string | number | symbol>(
  array: readonly T[],
  getGroupId: (item: T) => Key
): Partial<Record<Key, T[]>> => {
  return array.reduce(
    (acc, item) => {
      const groupId = getGroupId(item)
      if (!acc[groupId]) acc[groupId] = []
      acc[groupId].push(item)
      return acc
    },
    {} as Record<Key, T[]>
  )
}

/**
 * Sort an array without modifying it and return
 * the newly sorted value
 *
 * @template T - The type of items in the array
 * @param {readonly T[]} array - The array to sort
 * @param {SortType} [type] - Sort direction, either 'ASC' for ascending or 'DESC' for descending
 * @param {(item: T) => number} [getter] - Function to extract the numeric value to sort by. Defaults to treating items as numbers
 *
 */
export const sort = <T>(
  array: readonly T[],
  type: SortType = 'ASC',
  getter: (item: T) => number = (i) => i as number
) => {
  if (!array) return []
  const asc = (a: T, b: T) => getter(a) - getter(b)
  const dsc = (a: T, b: T) => getter(b) - getter(a)
  return array.slice().sort(type === 'DESC' ? dsc : asc)
}

/**
 * Sorts an array using the bubble sort algorithm without modifying the original array.
 * Returns a new sorted array. Uses an optimized version that stops early if no swaps occur.
 *
 * @template T - The type of items in the array
 * @param {T[]} array - The array to sort
 * @param {SortType} [type] - Sort direction, either 'ASC' for ascending or 'DESC' for descending
 * @param {(item: T) => number} [getter] - Function to extract the numeric value to sort by. Defaults to treating items as numbers
 *
 */
export function bubblingSort<T>(
  array: T[],
  type: SortType = 'ASC',
  getter: (item: T) => number = (i) => i as number
): T[] {
  if (!(Array.isArray(array) && array.length > 1)) return array

  const arr = array.slice()

  const compare = (a: T, b: T) => {
    if (type === 'DESC') {
      return getter(b) - getter(a)
    } else {
      return getter(a) - getter(b)
    }
  }

  for (let i = 0; i < arr.length - 1; i++) {
    let swapped = false

    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (compare(arr[j], arr[j + 1]) > 0) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        swapped = true
      }
    }

    if (!swapped) break
  }

  return arr
}

/**
 * Like a reduce but does not require an array.
 * Only need a number and will iterate the function
 * as many times as specified.
 *
 * NOTE: This is NOT zero indexed. If you pass count=5
 * you will get 1, 2, 3, 4, 5 iteration in the callback
 * function
 *
 * @template T - The type of the accumulated value
 * @param {number} count - The number of iterations to perform (1-indexed)
 * @param {(currentValue: T, iteration: number) => T} func - Function called on each iteration with the current value and iteration number (starting from 1)
 * @param {T} initValue - The initial value to start with
 *
 */
export const iterate = <T>(
  count: number,
  func: (currentValue: T, iteration: number) => T,
  initValue: T
) => {
  let value = initValue
  for (let i = 1; i <= count; i++) {
    value = func(value, i)
  }
  return value
}
