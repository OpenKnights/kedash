import { describe, expect, it } from 'vitest'
import { insertAt, transformCase } from '../src/string'

describe('string utilities', () => {
  describe('insertAt', () => {
    it('should insert text at specified position', () => {
      expect(insertAt('hello', 5, ' world')).toBe('hello world')
      expect(insertAt('hello', 0, 'say ')).toBe('say hello')
      expect(insertAt('hello', 2, 'X')).toBe('heXllo')
    })

    it('should handle negative positions', () => {
      expect(insertAt('hello', -1, 'X')).toBe('hellXo')
      expect(insertAt('hello', -3, 'X')).toBe('helXlo')
      expect(insertAt('hello', -10, 'X')).toBe('Xhello') // Beyond start
    })

    it('should handle positions beyond string length', () => {
      expect(insertAt('hello', 100, '!')).toBe('hello!')
    })

    it('should work with empty strings', () => {
      expect(insertAt('', 0, 'text')).toBe('text')
      expect(insertAt('hello', 2, '')).toBe('hello')
    })
  })

  describe('transformCase', () => {
    it('should transform with default settings (PascalCase)', () => {
      expect(transformCase('hello world')).toBe('Helloworld')
    })

    it('should transform to camelCase', () => {
      const result = transformCase('hello world', [' ', ''], ['lower', 'upper'])
      expect(result).toBe('helloWorld')
    })

    it('should transform to PascalCase', () => {
      const result = transformCase('hello world', [' ', ''], ['upper', 'upper'])
      expect(result).toBe('HelloWorld')
    })

    it('should transform to snake_case', () => {
      const result = transformCase(
        'hello world',
        [' ', '_'],
        ['lower', 'lower']
      )
      expect(result).toBe('hello_world')
    })

    it('should transform to kebab-case', () => {
      const result = transformCase(
        'hello world',
        [' ', '-'],
        ['lower', 'lower']
      )
      expect(result).toBe('hello-world')
    })

    it('should handle multiple word separators', () => {
      const result = transformCase(
        'hello-world-test',
        ['-', '_'],
        ['upper', 'lower']
      )
      expect(result).toBe('Hello_world_test')
    })

    it('should handle empty or whitespace strings', () => {
      expect(transformCase('')).toBe('')
      expect(transformCase('   ')).toBe('   ')
    })

    it('should preserve single words', () => {
      const result = transformCase('hello', [' ', ''], ['upper', 'upper'])
      expect(result).toBe('Hello')
    })

    it('should work with custom separators', () => {
      const result = transformCase(
        'hello_world_test',
        ['_', ' '],
        ['upper', 'lower']
      )
      expect(result).toBe('Hello world test')
    })
  })
})
