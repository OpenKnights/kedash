import { describe, expect, it } from 'vitest'

import { deepClone, shallowClone } from '../src/object'

describe('object utilities', () => {
  describe('shallowClone', () => {
    it('should clone primitive values', () => {
      expect(shallowClone(123)).toBe(123)
      expect(shallowClone('hello')).toBe('hello')
      expect(shallowClone(true)).toBe(true)
      expect(shallowClone(null)).toBe(null)
    })

    it('should shallow clone objects', () => {
      const obj = { a: 1, b: 2 }
      const cloned = shallowClone(obj)

      expect(cloned).toEqual(obj)
      expect(cloned).not.toBe(obj)

      cloned.a = 10
      expect(obj.a).toBe(1)
    })

    it('should shallow clone arrays', () => {
      const arr = [1, 2, 3]
      const cloned = shallowClone(arr)

      expect(cloned).toEqual(arr)
      expect(cloned).not.toBe(arr)

      cloned[0] = 10
      expect(arr[0]).toBe(1)
    })

    it('should not deep clone nested objects', () => {
      const obj = { a: { b: 1 } }
      const cloned = shallowClone(obj)

      expect(cloned.a).toBe(obj.a) // Same reference

      cloned.a.b = 10
      expect(obj.a.b).toBe(10) // Original is affected
    })

    it('should clone functions', () => {
      const fn = () => 'test'
      const cloned = shallowClone(fn)

      expect(cloned()).toBe('test')
      expect(cloned).not.toBe(fn)
    })
  })

  describe('deepClone', () => {
    it('should clone primitive values', () => {
      expect(deepClone(123)).toBe(123)
      expect(deepClone('hello')).toBe('hello')
      expect(deepClone(true)).toBe(true)
      expect(deepClone(null)).toBe(null)
      expect(deepClone(undefined)).toBe(undefined)
    })

    it('should deep clone objects', () => {
      const obj = { a: 1, b: { c: 2 } }
      const cloned = deepClone(obj)

      expect(cloned).toEqual(obj)
      expect(cloned).not.toBe(obj)
      expect(cloned.b).not.toBe(obj.b)

      cloned.b.c = 10
      expect(obj.b.c).toBe(2)
    })

    it('should deep clone arrays', () => {
      const arr = [1, [2, 3], { a: 4 }]
      const cloned = deepClone(arr)

      expect(cloned).toEqual(arr)
      expect(cloned).not.toBe(arr)
      expect(cloned[1]).not.toBe(arr[1])
      expect(cloned[2]).not.toBe(arr[2])
    })

    it('should handle circular references', () => {
      const obj: any = { a: 1 }
      obj.self = obj

      const cloned = deepClone(obj)

      expect(cloned.a).toBe(1)
      expect(cloned.self).toBe(cloned)
      expect(cloned).not.toBe(obj)
    })

    it('should clone Set', () => {
      const set = new Set([1, 2, { a: 3 }])
      const cloned = deepClone(set)

      expect(cloned).toBeInstanceOf(Set)
      expect(cloned.size).toBe(3)
      expect(cloned).not.toBe(set)

      const objInSet = Array.from(cloned)[2] as any
      expect(objInSet).toEqual({ a: 3 })
    })

    it('should clone Map', () => {
      const map = new Map<string, number | Record<string, any>>([
        ['a', 1],
        ['b', { c: 2 }]
      ])
      const cloned = deepClone(map)

      expect(cloned).toBeInstanceOf(Map)
      expect(cloned.size).toBe(2)
      expect(cloned).not.toBe(map)
      expect(cloned.get('b')).not.toBe(map.get('b'))
    })

    it('should clone Map with complex keys', () => {
      const keyObj = { id: 1 }
      const map = new Map([[keyObj, 'value']])
      const cloned = deepClone(map)

      expect(cloned.size).toBe(1)
      const clonedKey = Array.from(cloned.keys())[0]
      expect(clonedKey).not.toBe(keyObj)
      expect(clonedKey).toEqual(keyObj)
    })

    it('should clone Symbol properties', () => {
      const sym = Symbol('test')
      const obj = { [sym]: 'value', regular: 'prop' }
      const cloned = deepClone(obj)

      expect(cloned[sym]).toBe('value')
      expect(cloned.regular).toBe('prop')
    })

    it('should handle nested complex structures', () => {
      const complex = {
        arr: [1, 2, [3, 4]],
        obj: { nested: { deep: 'value' } },
        set: new Set([1, 2]),
        map: new Map([['key', { val: 1 }]])
      }

      const cloned = deepClone(complex)

      expect(cloned).toEqual(complex)
      expect(cloned.arr).not.toBe(complex.arr)
      expect(cloned.obj.nested).not.toBe(complex.obj.nested)
      expect(cloned.set).not.toBe(complex.set)
      expect(cloned.map).not.toBe(complex.map)
    })
  })
})
