import { describe, expect, it } from 'vitest'
import { bubblingSort, group, iterate, sort } from '../src/array'

describe('array utilities', () => {
  describe('group', () => {
    it('should group items by key', () => {
      const items = [
        { type: 'fruit', name: 'apple' },
        { type: 'fruit', name: 'banana' },
        { type: 'vegetable', name: 'carrot' }
      ]
      const result = group(items, (item) => item.type)

      expect(result.fruit).toHaveLength(2)
      expect(result.vegetable).toHaveLength(1)
      expect(result.fruit?.[0].name).toBe('apple')
    })

    it('should handle empty array', () => {
      const result = group([], (item) => item)
      expect(result).toEqual({})
    })

    it('should handle numeric keys', () => {
      const items = [1, 2, 3, 4, 5]
      const result = group(items, (item) => item % 2)

      expect(result[0]).toEqual([2, 4])
      expect(result[1]).toEqual([1, 3, 5])
    })
  })

  describe('sort', () => {
    it('should sort in ascending order by default', () => {
      const items = [{ age: 30 }, { age: 20 }, { age: 25 }]
      const result = sort(items, 'ASC', (item) => item.age)

      expect(result[0].age).toBe(20)
      expect(result[1].age).toBe(25)
      expect(result[2].age).toBe(30)
    })

    it('should sort in descending order', () => {
      const items = [{ age: 20 }, { age: 30 }, { age: 25 }]
      const result = sort(items, 'DESC', (item) => item.age)

      expect(result[0].age).toBe(30)
      expect(result[1].age).toBe(25)
      expect(result[2].age).toBe(20)
    })

    it('should not modify original array', () => {
      const original = [{ age: 30 }, { age: 20 }]
      const sorted = sort(original, 'ASC', (item) => item.age)

      expect(original[0].age).toBe(30)
      expect(sorted[0].age).toBe(20)
    })

    it('should handle empty array', () => {
      const result = sort([], 'ASC', (item) => item)
      expect(result).toEqual([])
    })
  })

  describe('bubblingSort', () => {
    it('should sort numbers in ascending order', () => {
      const arr = [5, 2, 8, 1, 9]
      const result = bubblingSort(arr, 'ASC')
      expect(result).toEqual([1, 2, 5, 8, 9])
    })

    it('should sort in descending order', () => {
      const arr = [5, 2, 8, 1, 9]
      const result = bubblingSort(arr, 'DESC')
      expect(result).toEqual([9, 8, 5, 2, 1])
    })

    it('should work with custom getter', () => {
      const arr = [{ val: 5 }, { val: 2 }, { val: 8 }]
      const result = bubblingSort(arr, 'ASC', (item) => item.val)
      expect(result[0].val).toBe(2)
      expect(result[2].val).toBe(8)
    })

    it('should handle single element array', () => {
      const arr = [1]
      const result = bubblingSort(arr)
      expect(result).toEqual([1])
    })
  })

  describe('iterate', () => {
    it('should iterate specified number of times', () => {
      const result = iterate(5, (acc, i) => acc + i, 0)
      expect(result).toBe(15) // 1+2+3+4+5
    })

    it('should work with string accumulator', () => {
      const result = iterate(3, (acc, i) => acc + i, '')
      expect(result).toBe('123')
    })

    it('should handle zero iterations', () => {
      const result = iterate(0, (acc, i) => acc + i, 10)
      expect(result).toBe(10)
    })

    it('should pass correct iteration number', () => {
      const iterations: number[] = []
      iterate(
        3,
        (acc, i) => {
          iterations.push(i)
          return acc
        },
        null
      )
      expect(iterations).toEqual([1, 2, 3])
    })
  })
})
