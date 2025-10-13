import { describe, expect, it } from 'vitest'
import { formatDate } from '../src/date'

describe('date utilities', () => {
  describe('formatDate', () => {
    it('should format date with default format', () => {
      const date = new Date('2023-06-15T14:30:45')
      const result = formatDate(date)

      expect(result).toBe('2023-06-15 14:30:45')
    })

    it('should format date with custom format', () => {
      const date = new Date('2023-06-15T14:30:45')
      const result = formatDate(date, 'yyyy/MM/dd')

      expect(result).toBe('2023/06/15')
    })

    it('should format time only', () => {
      const date = new Date('2023-06-15T14:30:45')
      const result = formatDate(date, 'HH:mm:ss')

      expect(result).toBe('14:30:45')
    })

    it('should handle single digit dates with padding', () => {
      const date = new Date('2023-01-05T08:05:09')
      const result = formatDate(date)

      expect(result).toBe('2023-01-05 08:05:09')
    })

    it('should format with week day', () => {
      const date = new Date('2023-06-15') // Thursday
      const result = formatDate(date, 'yyyy-MM-dd W')

      expect(result).toContain('2023-06-15')
      expect(['日', '一', '二', '三', '四', '五', '六']).toContain(
        result.split(' ')[1]
      )
    })

    it('should handle string dates', () => {
      const result = formatDate('2023-06-15T14:30:45', 'yyyy-MM-dd')
      expect(result).toBe('2023-06-15')
    })

    it('should handle timestamp numbers', () => {
      const timestamp = new Date('2023-06-15T14:30:45').getTime()
      const result = formatDate(timestamp, 'yyyy-MM-dd HH:mm:ss')

      expect(result).toBe('2023-06-15 14:30:45')
    })

    it('should return formatted value object when format is empty', () => {
      const date = new Date('2023-06-15T14:30:45')
      const result = formatDate(date, '')

      expect(typeof result).toBe('object')
      expect((result as any).year).toBe('2023')
      expect((result as any).month).toBe('06')
      expect((result as any).day).toBe('15')
      expect((result as any).hours).toBe('14')
      expect((result as any).minutes).toBe('30')
      expect((result as any).seconds).toBe('45')
    })

    it('should return formatted value object when format is null', () => {
      const date = new Date('2023-06-15T14:30:45')
      const result = formatDate(date, null)

      expect(typeof result).toBe('object')
      expect((result as any).year).toBe('2023')
    })

    it('should handle complex format patterns', () => {
      const date = new Date('2023-12-25T23:59:59')
      const result = formatDate(date, 'yyyy年MM月dd日 HH时mm分ss秒')

      expect(result).toBe('2023年12月25日 23时59分59秒')
    })

    it('should handle empty date input', () => {
      const result = formatDate(null as any)
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })
  })
})
