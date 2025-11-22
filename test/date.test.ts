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

    it('should format with week day (Chinese)', () => {
      const date = new Date('2023-06-15') // Thursday
      const result = formatDate(date, 'yyyy-MM-dd 星期WK')

      expect(result).toContain('2023-06-15')
      expect(result).toMatch(/星期[日一二三四五六]/)
    })
    it('should format with week day (English)', () => {
      const date = new Date('2023-06-15') // Thursday
      const result = formatDate(date, 'yyyy-MM-dd WK', { weekNames: 'en' })

      expect(result).toContain('2023-06-15')
      expect(result).toMatch(
        /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/
      )
    })

    it('should format with custom week names', () => {
      const date = new Date('2023-06-15') // Thursday (day 4)
      const customWeekNames = {
        0: 'Sun',
        1: 'Mon',
        2: 'Tue',
        3: 'Wed',
        4: 'Thu',
        5: 'Fri',
        6: 'Sat'
      }
      const result = formatDate(date, 'yyyy-MM-dd WK', {
        weekNames: customWeekNames
      })

      expect(result).toContain('2023-06-15')
      expect(result).toContain('Thu')
    })

    it('should use Chinese week names by default', () => {
      const sunday = new Date('2023-06-18') // Sunday
      const monday = new Date('2023-06-19') // Monday

      const resultSun = formatDate(sunday, 'WK')
      const resultMon = formatDate(monday, 'WK')

      expect(resultSun).toBe('日')
      expect(resultMon).toBe('一')
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
      expect((result as any).week).toBe('四') // Thursday in Chinese
      expect((result as any).weekNum).toBe(4)
    })

    it('should return formatted value object when format is null', () => {
      const date = new Date('2023-06-15T14:30:45')
      const result = formatDate(date, null)

      expect(typeof result).toBe('object')
      expect((result as any).year).toBe('2023')
      expect((result as any).week).toBe('四')
    })

    it('should return formatted value object with English week names', () => {
      const date = new Date('2023-06-15T14:30:45')
      const result = formatDate(date, null, { weekNames: 'en' })

      expect(typeof result).toBe('object')
      expect((result as any).week).toBe('Thursday')
      expect((result as any).weekNum).toBe(4)
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

    it('should handle multiple WK placeholders', () => {
      const date = new Date('2023-06-15') // Thursday
      const result = formatDate(date, 'WK - WK', { weekNames: 'en' })

      expect(result).toBe('Thursday - Thursday')
    })

    it('should work with all days of the week (Chinese)', () => {
      const dates = [
        { date: new Date('2023-06-18'), expected: '日' }, // Sunday
        { date: new Date('2023-06-19'), expected: '一' }, // Monday
        { date: new Date('2023-06-20'), expected: '二' }, // Tuesday
        { date: new Date('2023-06-21'), expected: '三' }, // Wednesday
        { date: new Date('2023-06-22'), expected: '四' }, // Thursday
        { date: new Date('2023-06-23'), expected: '五' }, // Friday
        { date: new Date('2023-06-24'), expected: '六' } // Saturday
      ]

      dates.forEach(({ date, expected }) => {
        const result = formatDate(date, 'WK')
        expect(result).toBe(expected)
      })
    })

    it('should work with all days of the week (English)', () => {
      const dates = [
        { date: new Date('2023-06-18'), expected: 'Sunday' },
        { date: new Date('2023-06-19'), expected: 'Monday' },
        { date: new Date('2023-06-20'), expected: 'Tuesday' },
        { date: new Date('2023-06-21'), expected: 'Wednesday' },
        { date: new Date('2023-06-22'), expected: 'Thursday' },
        { date: new Date('2023-06-23'), expected: 'Friday' },
        { date: new Date('2023-06-24'), expected: 'Saturday' }
      ]

      dates.forEach(({ date, expected }) => {
        const result = formatDate(date, 'WK', { weekNames: 'en' })
        expect(result).toBe(expected)
      })
    })
  })
})
