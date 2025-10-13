import { describe, expect, it } from 'vitest'
import {
  getType,
  isArray,
  isDate,
  isEmpty,
  isEqual,
  isFloat,
  isFunction,
  isInt,
  isNumber,
  isObject,
  isPrimitive,
  isPromise,
  isString,
  isSymbol,
  isType
} from '../src/typed'

describe('typed utilities', () => {
  describe('isSymbol', () => {
    it('should return true for symbols', () => {
      expect(isSymbol(Symbol('test'))).toBe(true)
      expect(isSymbol(Symbol())).toBe(true)
    })

    it('should return false for non-symbols', () => {
      expect(isSymbol('string')).toBe(false)
      expect(isSymbol(123)).toBe(false)
      expect(isSymbol(null)).toBe(false)
    })
  })

  describe('isArray', () => {
    it('should return true for arrays', () => {
      expect(isArray([])).toBe(true)
      expect(isArray([1, 2, 3])).toBe(true)
    })

    it('should return false for non-arrays', () => {
      expect(isArray({})).toBe(false)
      expect(isArray('string')).toBe(false)
      expect(isArray(null)).toBe(false)
    })
  })

  describe('isObject', () => {
    it('should return true for plain objects', () => {
      expect(isObject({})).toBe(true)
      expect(isObject({ a: 1 })).toBe(true)
    })

    it('should return false for non-plain objects', () => {
      expect(isObject([])).toBe(false)
      expect(isObject(null)).toBe(false)
      expect(isObject(new Date())).toBe(false)
    })
  })

  describe('isPrimitive', () => {
    it('should return true for primitives', () => {
      expect(isPrimitive(null)).toBe(true)
      expect(isPrimitive(undefined)).toBe(true)
      expect(isPrimitive(123)).toBe(true)
      expect(isPrimitive('string')).toBe(true)
      expect(isPrimitive(true)).toBe(true)
      expect(isPrimitive(Symbol())).toBe(true)
      expect(isPrimitive(BigInt(123))).toBe(true)
    })

    it('should return false for objects and functions', () => {
      expect(isPrimitive({})).toBe(false)
      expect(isPrimitive([])).toBe(false)
      expect(isPrimitive(() => {})).toBe(false)
    })
  })

  describe('isFunction', () => {
    it('should return true for functions', () => {
      expect(isFunction(() => {})).toBe(true)
      expect(isFunction(function () {})).toBe(true)
      expect(isFunction(async () => {})).toBe(true)
    })

    it('should return false for non-functions', () => {
      expect(isFunction({})).toBe(false)
      expect(isFunction('string')).toBe(false)
      expect(isFunction(null)).toBe(false)
    })
  })

  describe('isString', () => {
    it('should return true for strings', () => {
      expect(isString('hello')).toBe(true)
      expect(isString('')).toBe(true)
      // eslint-disable-next-line unicorn/new-for-builtins
      expect(isString(new String('test'))).toBe(true)
    })

    it('should return false for non-strings', () => {
      expect(isString(123)).toBe(false)
      expect(isString(null)).toBe(false)
      expect(isString([])).toBe(false)
    })
  })

  describe('isNumber', () => {
    it('should return true for numbers', () => {
      expect(isNumber(123)).toBe(true)
      expect(isNumber(0)).toBe(true)
      expect(isNumber(-5.5)).toBe(true)
      expect(isNumber(Infinity)).toBe(true)
    })

    it('should return false for non-numbers', () => {
      expect(isNumber('123')).toBe(false)
      expect(isNumber(null)).toBe(false)
      expect(isNumber(Number.NaN)).toBe(false)
    })
  })

  describe('isInt', () => {
    it('should return true for integers', () => {
      expect(isInt(123)).toBe(true)
      expect(isInt(0)).toBe(true)
      expect(isInt(-5)).toBe(true)
    })

    it('should return false for floats and non-numbers', () => {
      expect(isInt(5.5)).toBe(false)
      expect(isInt('123')).toBe(false)
      expect(isInt(Number.NaN)).toBe(false)
    })
  })

  describe('isFloat', () => {
    it('should return true for floats', () => {
      expect(isFloat(5.5)).toBe(true)
      expect(isFloat(-3.14)).toBe(true)
    })

    it('should return false for integers and non-numbers', () => {
      expect(isFloat(5)).toBe(false)
      expect(isFloat('5.5')).toBe(false)
      expect(isFloat(Number.NaN)).toBe(false)
    })
  })

  describe('isDate', () => {
    it('should return true for Date objects', () => {
      expect(isDate(new Date())).toBe(true)
    })

    it('should return false for non-Date objects', () => {
      expect(isDate('2023-01-01')).toBe(false)
      expect(isDate(123456789)).toBe(false)
      expect(isDate(null)).toBe(false)
    })
  })

  describe('isPromise', () => {
    it('should return true for promises', () => {
      expect(isPromise(Promise.resolve())).toBe(true)
      expect(isPromise(new Promise(() => {}))).toBe(true)
    })

    it('should return false for non-promises', () => {
      expect(isPromise({})).toBe(false)
      expect(isPromise({ then: 'not a function' })).toBe(false)
      expect(isPromise(null)).toBe(false)
    })
  })

  describe('isEmpty', () => {
    it('should return true for empty values', () => {
      expect(isEmpty(null)).toBe(true)
      expect(isEmpty(undefined)).toBe(true)
      expect(isEmpty(true)).toBe(true)
      expect(isEmpty(false)).toBe(true)
      expect(isEmpty(0)).toBe(true)
      expect(isEmpty('')).toBe(true)
      expect(isEmpty([])).toBe(true)
      expect(isEmpty({})).toBe(true)
    })

    it('should return false for non-empty values', () => {
      expect(isEmpty(1)).toBe(false)
      expect(isEmpty('text')).toBe(false)
      expect(isEmpty([1])).toBe(false)
      expect(isEmpty({ a: 1 })).toBe(false)
      expect(isEmpty(() => {})).toBe(false)
    })

    it('should handle Maps and Sets', () => {
      expect(isEmpty(new Map())).toBe(true)
      expect(isEmpty(new Set())).toBe(true)
      expect(isEmpty(new Map([['a', 1]]))).toBe(false)
      expect(isEmpty(new Set([1]))).toBe(false)
    })
  })

  describe('isEqual', () => {
    it('should return true for equal primitives', () => {
      expect(isEqual(1, 1)).toBe(true)
      expect(isEqual('hello', 'hello')).toBe(true)
      expect(isEqual(true, true)).toBe(true)
    })

    it('should return true for equal objects', () => {
      expect(isEqual({ a: 1 }, { a: 1 })).toBe(true)
      expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
    })

    it('should return true for equal nested objects', () => {
      expect(isEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true)
    })

    it('should return false for unequal values', () => {
      expect(isEqual(1, 2)).toBe(false)
      expect(isEqual({ a: 1 }, { a: 2 })).toBe(false)
      expect(isEqual({ a: 1 }, { b: 1 })).toBe(false)
    })

    it('should handle dates', () => {
      const date1 = new Date('2023-01-01')
      const date2 = new Date('2023-01-01')
      const date3 = new Date('2023-01-02')

      expect(isEqual(date1, date2)).toBe(true)
      expect(isEqual(date1, date3)).toBe(false)
    })

    it('should handle regular expressions', () => {
      expect(isEqual(/test/g, /test/g)).toBe(true)
      expect(isEqual(/test/g, /test/i)).toBe(false)
    })
  })

  describe('getType', () => {
    it('should return correct type names', () => {
      expect(getType('hello')).toBe('string')
      expect(getType(123)).toBe('number')
      expect(getType(true)).toBe('boolean')
      expect(getType([])).toBe('array')
      expect(getType({})).toBe('object')
      expect(getType(null)).toBe('null')
      expect(getType(undefined)).toBe('undefined')
      expect(getType(new Date())).toBe('date')
      expect(getType(/regex/)).toBe('regexp')
      expect(getType(new Map())).toBe('map')
      expect(getType(new Set())).toBe('set')
      expect(getType(Promise.resolve())).toBe('promise')
      expect(getType(Symbol())).toBe('symbol')
    })
  })

  describe('isType', () => {
    it('should check type correctly', () => {
      expect(isType('string', 'hello')).toBe(true)
      expect(isType('number', 123)).toBe(true)
      expect(isType('array', [])).toBe(true)
      expect(isType('object', {})).toBe(true)
      expect(isType('map', new Map())).toBe(true)
      expect(isType('set', new Set())).toBe(true)
    })

    it('should return false for wrong types', () => {
      expect(isType('string', 123)).toBe(false)
      expect(isType('array', {})).toBe(false)
    })
  })
})
