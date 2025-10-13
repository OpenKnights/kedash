import { describe, expect, it } from 'vitest'
import { padNumber, toFloat, toInt } from '../src/number'

describe('number utilities', () => {
  describe('toFloat', () => {
    it('should convert valid strings to float', () => {
      expect(toFloat('3.14')).toBe(3.14)
      expect(toFloat('0.5')).toBe(0.5)
      expect(toFloat('-2.5')).toBe(-2.5)
    })

    it('should convert integers to float', () => {
      expect(toFloat(5)).toBe(5)
      expect(toFloat('10')).toBe(10)
    })

    it('should return default value for invalid input', () => {
      expect(toFloat('invalid')).toBe(0.0)
      expect(toFloat('abc')).toBe(0.0)
      expect(toFloat(undefined)).toBe(0.0)
    })

    it('should use custom default value', () => {
      expect(toFloat('invalid', -1)).toBe(-1)
      expect(toFloat(null, 999)).toBe(999)
    })

    it('should handle null and undefined', () => {
      expect(toFloat(null)).toBe(0.0)
      expect(toFloat(undefined)).toBe(0.0)
    })

    it('should handle edge cases', () => {
      expect(toFloat('0')).toBe(0)
      expect(toFloat('0.0')).toBe(0)
      expect(toFloat('')).toBe(0.0)
    })
  })

  describe('toInt', () => {
    it('should convert valid strings to integer', () => {
      expect(toInt('42')).toBe(42)
      expect(toInt('100')).toBe(100)
      expect(toInt('-5')).toBe(-5)
    })

    it('should truncate floats to integers', () => {
      expect(toInt('3.14')).toBe(3)
      expect(toInt('9.99')).toBe(9)
      expect(toInt(5.7)).toBe(5)
    })

    it('should return default value for invalid input', () => {
      expect(toInt('invalid')).toBe(0)
      expect(toInt('xyz')).toBe(0)
      expect(toInt(undefined)).toBe(0)
    })

    it('should use custom default value', () => {
      expect(toInt('invalid', -1)).toBe(-1)
      expect(toInt(null, 42)).toBe(42)
    })

    it('should handle null and undefined', () => {
      expect(toInt(null)).toBe(0)
      expect(toInt(undefined)).toBe(0)
    })

    it('should handle edge cases', () => {
      expect(toInt('0')).toBe(0)
      expect(toInt('')).toBe(0)
    })
  })

  describe('padNumber', () => {
    it('should pad single digit numbers', () => {
      expect(padNumber(5)).toBe('05')
      expect(padNumber(9)).toBe('09')
      expect(padNumber(0)).toBe('00')
    })

    it('should not pad double digit numbers', () => {
      expect(padNumber(10)).toBe('10')
      expect(padNumber(25)).toBe('25')
      expect(padNumber(99)).toBe('99')
    })

    it('should handle numbers greater than 99', () => {
      expect(padNumber(100)).toBe('100')
      expect(padNumber(999)).toBe('999')
    })

    it('should handle negative numbers', () => {
      expect(padNumber(-5)).toBe('-5')
      expect(padNumber(-10)).toBe('-10')
    })
  })
})
