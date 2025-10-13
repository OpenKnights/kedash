import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { compose, currying, debounce, throttle } from '../src/curry'

describe('curry utilities', () => {
  describe('currying', () => {
    it('should curry a function', () => {
      const add = (a: number, b: number, c: number) => a + b + c
      const curried = currying(add)

      expect(curried(1)(2)(3)).toBe(6)
    })

    it('should work with partial application', () => {
      const add = (a: number, b: number, c: number) => a + b + c
      const curried = currying(add)

      const addOne = curried(1)
      expect(addOne(2, 3)).toBe(6)
      expect(addOne(5)(6)).toBe(12)
    })

    it('should execute immediately if all args provided', () => {
      const multiply = (a: number, b: number) => a * b
      const curried = currying(multiply)

      expect(curried(3, 4)).toBe(12)
    })
  })

  describe('compose', () => {
    it('should compose functions left to right', () => {
      const add2 = (x: number) => x + 2
      const multiply3 = (x: number) => x * 3
      const composed = compose(add2, multiply3)

      expect(composed?.(5)).toBe(21) // (5 + 2) * 3
    })

    it('should work with multiple functions', () => {
      const add1 = (x: number) => x + 1
      const multiply2 = (x: number) => x * 2
      const subtract3 = (x: number) => x - 3
      const composed = compose(add1, multiply2, subtract3)

      expect(composed?.(5)).toBe(9) // ((5 + 1) * 2) - 3 = 9
    })

    it('should return null for empty function list', () => {
      const composed = compose()
      expect(composed).toBeNull()
    })

    it('should throw error if non-function is passed', () => {
      expect(() => compose((() => 1) as any, 'not a function' as any)).toThrow(
        TypeError
      )
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should debounce function calls', async () => {
      const fn = vi.fn((x: number) => x * 2)
      const debounced = debounce(fn, 100)

      debounced(1)
      debounced(2)
      debounced(3)

      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)
      await vi.runAllTimersAsync()

      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith(3)
    })

    it('should execute immediately when immediate is true', async () => {
      const fn = vi.fn((x: number) => x * 2)
      const debounced = debounce(fn, 100, true)

      const promise = debounced(5)

      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith(5)

      await promise
    })

    it('should cancel pending execution', async () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 100)

      debounced()
      debounced.cancel()

      vi.advanceTimersByTime(100)
      await vi.runAllTimersAsync()

      expect(fn).not.toHaveBeenCalled()
    })

    it('should return promise that resolves with result', async () => {
      const fn = vi.fn((x: number) => x * 2)
      const debounced = debounce(fn, 100)

      const promise = debounced(5)
      vi.advanceTimersByTime(100)

      const result = await promise
      expect(result).toBe(10)
    })
  })

  describe('throttle', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throttle function calls', async () => {
      const fn = vi.fn((x: number) => x)
      const throttled = throttle(fn, 100)

      throttled(1)
      throttled(2)
      throttled(3)

      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith(1)
    })

    it('should respect leading option', async () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 100, { leading: false })

      throttled()
      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)
      await vi.runAllTimersAsync()
    })

    it('should respect trailing option', async () => {
      const fn = vi.fn((x: number) => x)
      const throttled = throttle(fn, 100, { trailing: true })

      throttled(1)
      throttled(2)

      vi.advanceTimersByTime(100)
      await vi.runAllTimersAsync()

      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should cancel throttled execution', () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 100)

      throttled()
      throttled.cancel()

      vi.advanceTimersByTime(100)

      expect(fn).toHaveBeenCalledTimes(1) // Only the first call
    })
  })
})
