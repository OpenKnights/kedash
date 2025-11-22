import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { random, setSerialInterval, toQueryString, uid } from '../src/other'

describe('other utilities', () => {
  describe('setSerialInterval', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should execute function serially with delay', async () => {
      const fn = vi.fn()
      const timer = setSerialInterval(fn, 100)

      expect(fn).not.toHaveBeenCalled()

      await vi.advanceTimersByTimeAsync(100)
      expect(fn).toHaveBeenCalledTimes(1)

      await vi.advanceTimersByTimeAsync(100)
      expect(fn).toHaveBeenCalledTimes(2)

      timer.cancel()
    })

    it('should cancel execution', async () => {
      const fn = vi.fn()
      const timer = setSerialInterval(fn, 100)

      timer.cancel()

      await vi.advanceTimersByTimeAsync(200)
      expect(fn).not.toHaveBeenCalled()
    })

    it('should execute multiple times serially', async () => {
      const fn = vi.fn()
      const timer = setSerialInterval(fn, 100)

      // First execution
      await vi.advanceTimersByTimeAsync(100)
      expect(fn).toHaveBeenCalledTimes(1)

      // Second execution
      await vi.advanceTimersByTimeAsync(100)
      expect(fn).toHaveBeenCalledTimes(2)

      // Third execution
      await vi.advanceTimersByTimeAsync(100)
      expect(fn).toHaveBeenCalledTimes(3)

      timer.cancel()
    })
  })

  describe('random', () => {
    it('should generate number within range', () => {
      for (let i = 0; i < 100; i++) {
        const result = random(1, 10)
        expect(result).toBeGreaterThanOrEqual(1)
        expect(result).toBeLessThanOrEqual(10)
        expect(Number.isInteger(result)).toBe(true)
      }
    })

    it('should handle same min and max', () => {
      expect(random(5, 5)).toBe(5)
    })

    it('should handle negative ranges', () => {
      for (let i = 0; i < 50; i++) {
        const result = random(-10, -5)
        expect(result).toBeGreaterThanOrEqual(-10)
        expect(result).toBeLessThanOrEqual(-5)
      }
    })

    it('should handle zero in range', () => {
      for (let i = 0; i < 50; i++) {
        const result = random(-5, 5)
        expect(result).toBeGreaterThanOrEqual(-5)
        expect(result).toBeLessThanOrEqual(5)
      }
    })
  })

  describe('uid', () => {
    it('should generate string of specified length', () => {
      expect(uid(10).length).toBe(10)
      expect(uid(20).length).toBe(20)
      expect(uid(5).length).toBe(5)
    })

    it('should generate unique strings', () => {
      const ids = new Set()
      for (let i = 0; i < 100; i++) {
        ids.add(uid(10))
      }
      expect(ids.size).toBe(100)
    })

    it('should only contain alphanumeric characters by default', () => {
      const id = uid(100)
      expect(/^[A-Z0-9]+$/i.test(id)).toBe(true)
    })

    it('should include special characters when specified', () => {
      const id = uid(50, '!@#')
      expect(/^[A-Z0-9!@#]+$/i.test(id)).toBe(true)
    })

    it('should handle zero length', () => {
      expect(uid(0)).toBe('')
    })
  })

  describe('toQueryString', () => {
    it('should convert simple object to query string', () => {
      const params = { name: 'John', age: 25 }
      const result = toQueryString(params)

      expect(result).toContain('name=John')
      expect(result).toContain('age=25')
      expect(result).toContain('&')
    })

    it('should handle nested objects with bracket notation', () => {
      const params = {
        filter: { status: 'active', type: 'user' },
        page: 1
      }
      const result = toQueryString(params)

      expect(result).toContain('filter%5Bstatus%5D=active') // filter[status]=active
      expect(result).toContain('filter%5Btype%5D=user') // filter[type]=user
      expect(result).toContain('page=1')
    })

    it('should skip null, undefined, and empty string values', () => {
      const params = {
        name: 'John',
        email: null,
        phone: undefined,
        address: ''
      }
      const result = toQueryString(params)

      expect(result).toBe('name=John')
    })

    it('should encode special characters', () => {
      const params = { search: 'hello world', tag: 'foo&bar' }
      const result = toQueryString(params)

      expect(result).toContain('search=hello%20world')
      expect(result).toContain('tag=foo%26bar')
    })

    it('should handle empty object', () => {
      const result = toQueryString({})
      expect(result).toBe('')
    })

    it('should handle arrays as string values', () => {
      const params = { ids: [1, 2, 3] }
      const result = toQueryString(params)

      expect(result).toBe('ids=1%2C2%2C3') // Array is converted to string
    })

    it('should skip empty nested values', () => {
      const params = {
        filter: { name: 'John', status: null, type: '' }
      }
      const result = toQueryString(params)

      expect(result).toBe('filter%5Bname%5D=John')
    })

    it('should handle multiple nested objects', () => {
      const params = {
        filter: { status: 'active' },
        sort: { by: 'name', order: 'asc' }
      }
      const result = toQueryString(params)

      expect(result).toContain('filter%5Bstatus%5D=active')
      expect(result).toContain('sort%5Bby%5D=name')
      expect(result).toContain('sort%5Border%5D=asc')
    })
  })
})
