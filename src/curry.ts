import type { ThrottleOptions } from './types'

/**
 * Converts a function into a curried function that can be called with partial arguments.
 * A curried function can be called multiple times with fewer arguments than required,
 * and will return a new function until all arguments are provided.
 *
 * @param {(...args: any[]) => any} fn - The function to curry
 *
 */
export function currying(fn: (...args: any[]) => any) {
  function curried(this: any, ...args: any[]) {
    if (args.length >= fn.length) return fn.apply(this, args)

    return function subCurried(this: any, ...args2: any[]) {
      return curried.apply(this, args.concat(args2))
    }
  }
  return curried
}

/**
 * Composes multiple functions into a single function that executes them from left to right.
 * Each function receives the result of the previous function as its argument.
 *
 * @param {...((...args: any[]) => any)[]} fns - Functions to compose
 *
 */
export function compose(...fns: ((...args: any[]) => any)[]) {
  const { length } = fns
  if (length <= 0) return null
  for (let i = 0; i < length; i++) {
    const fn = fns[i]
    if (typeof fn !== 'function') {
      throw new TypeError(`argument with index ${i} is not a function`)
    }
  }
  function executeFn(this: any, ...args: any[]) {
    let index = 0
    let result = fns[index].apply(this, args)
    while (++index < length) {
      result = fns[index].call(this, result)
    }
    return result
  }

  return executeFn
}

/**
 * Creates a debounced function that delays invoking the callback until after the specified
 * delay has elapsed since the last time the debounced function was invoked.
 * Returns a Promise that resolves with the callback's return value.
 *
 * @template T - The type of the callback function
 * @param {T} callback - The function to debounce
 * @param {number} [delay=0] - The number of milliseconds to delay
 * @param {boolean} [immediate=false] - If true, invoke the callback on the leading edge instead of the trailing edge
 *
 */
export function debounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 0,
  immediate: boolean = false
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) & {
  cancel: () => void
} {
  let timer: ReturnType<typeof setTimeout> | null = null
  let isInvoke: boolean = false

  function subDebounce(this: any, ...args: Parameters<T>) {
    return new Promise<ReturnType<T>>((resolve, reject) => {
      if (timer !== null) clearTimeout(timer)

      if (immediate && !isInvoke) {
        try {
          const result: ReturnType<T> = callback.apply(this, args)
          resolve(result)
        } catch (error) {
          reject(error)
        }
        isInvoke = true
        return
      }

      timer = setTimeout(() => {
        try {
          const result: ReturnType<T> = callback.apply(this, args)
          resolve(result)
        } catch (error) {
          reject(error)
        } finally {
          timer = null
          isInvoke = false
        }
      }, delay)
    })
  }

  subDebounce.cancel = () => {
    if (timer !== null) clearTimeout(timer)
    timer = null
    isInvoke = false
  }

  return subDebounce
}

/**
 * Creates a throttled function that only invokes the callback at most once per specified interval.
 * Returns a Promise that resolves with the callback's return value.
 *
 * @template T - The type of the callback function
 * @param {T} callback - The function to throttle
 * @param {number} interval - The number of milliseconds to throttle invocations to
 * @param {ThrottleOptions} [options={}] - ThrottleOptions object
 *
 */
export function throttle<T extends (...args: any[]) => any>(
  callback: T,
  interval: number,
  options: ThrottleOptions = {}
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) & {
  cancel: () => void
} {
  const { leading = true, trailing = false } = options
  let startTime: number = 0
  let timer: ReturnType<typeof setTimeout> | null = null

  function subThrottle(this: any, ...args: Parameters<T>) {
    return new Promise<ReturnType<T>>((resolve, reject) => {
      try {
        const nowTime = Date.now()
        let result: ReturnType<T>
        if (!leading && startTime === 0) startTime = nowTime

        const waitTime = interval - (nowTime - startTime)
        if (waitTime <= 0) {
          if (timer) clearTimeout(timer)
          result = callback.apply(this, args)
          resolve(result)
          startTime = nowTime
          timer = null
          return
        }

        if (trailing && !timer) {
          timer = setTimeout(() => {
            result = callback.apply(this, args)
            resolve(result)
            startTime = Date.now()
            timer = null
          }, waitTime)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  subThrottle.cancel = () => {
    if (timer) clearTimeout(timer)
    startTime = 0
    timer = null
  }

  return subThrottle
}
