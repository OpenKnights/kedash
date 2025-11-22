import { describe, expect, it } from 'vitest'

import { sleep, tryit } from '../src/async'

describe('async utilities', () => {
  describe('sleep', () => {
    it('should wait for specified milliseconds', async () => {
      const start = Date.now()
      await sleep(100)
      const elapsed = Date.now() - start

      expect(elapsed).toBeGreaterThanOrEqual(95)
      expect(elapsed).toBeLessThan(150)
    })

    it('should resolve with no value', async () => {
      const result = await sleep(10)
      expect(result).toBeUndefined()
    })
  })

  describe('tryit', () => {
    it('should return [undefined, result] for successful sync function', () => {
      const fn = tryit((x: number) => x * 2)
      const [error, result] = fn(5)

      expect(error).toBeUndefined()
      expect(result).toBe(10)
    })

    it('should return [error, undefined] for failing sync function', () => {
      const fn = tryit(() => {
        throw new Error('test error')

        return false
      })

      const [error, result] = fn()

      expect(error).toBeInstanceOf(Error)
      expect(error?.message).toBe('test error')
      expect(result).toBeUndefined()
    })

    it('should handle async functions that succeed', async () => {
      const fn = tryit(async (x: number) => {
        await sleep(10)
        return x * 2
      })
      const [error, result] = await fn(5)

      expect(error).toBeUndefined()
      expect(result).toBe(10)
    })

    it('should handle async functions that fail', async () => {
      const fn = tryit(async () => {
        await sleep(10)
        throw new Error('async error')
      })
      const [error, result] = await fn()

      expect(error).toBeInstanceOf(Error)
      expect(error?.message).toBe('async error')
      expect(result).toBeUndefined()
    })

    it('should handle functions with multiple arguments', () => {
      const fn = tryit((a: number, b: number, c: number) => a + b + c)
      const [error, result] = fn(1, 2, 3)

      expect(error).toBeUndefined()
      expect(result).toBe(6)
    })

    it('should preserve function arguments', () => {
      const fn = tryit((str: string, num: number) => `${str}-${num}`)
      const [_error, result] = fn('test', 42)

      expect(result).toBe('test-42')
    })
  })
})
