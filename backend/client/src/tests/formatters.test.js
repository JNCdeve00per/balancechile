import { describe, it, expect } from 'vitest'
import { 
  formatCurrency, 
  formatLargeNumber, 
  formatPercentage,
  generateColors,
  truncateText 
} from '../src/utils/formatters'

describe('formatCurrency', () => {
  it('formats CLP currency correctly', () => {
    expect(formatCurrency(1000000, 'CLP')).toContain('1.000.000')
  })

  it('formats USD currency correctly', () => {
    expect(formatCurrency(1000000, 'USD')).toContain('1.000.000')
  })

  it('handles null values', () => {
    expect(formatCurrency(null)).toBe('N/A')
    expect(formatCurrency(undefined)).toBe('N/A')
  })
})

describe('formatLargeNumber', () => {
  it('formats billions correctly', () => {
    expect(formatLargeNumber(1500000000000)).toBe('1.5B')
  })

  it('formats millions correctly', () => {
    expect(formatLargeNumber(1500000000)).toBe('1.5MM')
  })

  it('formats thousands correctly', () => {
    expect(formatLargeNumber(1500000)).toBe('1.5M')
  })

  it('formats small numbers correctly', () => {
    expect(formatLargeNumber(1500)).toBe('1.5K')
  })

  it('handles null values', () => {
    expect(formatLargeNumber(null)).toBe('N/A')
  })
})

describe('formatPercentage', () => {
  it('formats percentage with default decimals', () => {
    expect(formatPercentage(15.678)).toBe('15.7%')
  })

  it('formats percentage with custom decimals', () => {
    expect(formatPercentage(15.678, 2)).toBe('15.68%')
  })

  it('handles null values', () => {
    expect(formatPercentage(null)).toBe('N/A')
  })
})

describe('generateColors', () => {
  it('returns correct number of colors', () => {
    const colors = generateColors(5)
    expect(colors).toHaveLength(5)
  })

  it('returns predefined colors for small counts', () => {
    const colors = generateColors(3)
    expect(colors[0]).toBe('#3b82f6')
    expect(colors[1]).toBe('#ef4444')
    expect(colors[2]).toBe('#10b981')
  })

  it('generates additional colors for large counts', () => {
    const colors = generateColors(15)
    expect(colors).toHaveLength(15)
    expect(colors[10]).toMatch(/^hsl\(\d+, 70%, 50%\)$/)
  })
})

describe('truncateText', () => {
  it('truncates long text', () => {
    const longText = 'This is a very long text that should be truncated'
    expect(truncateText(longText, 20)).toBe('This is a very long ...')
  })

  it('returns original text if shorter than limit', () => {
    const shortText = 'Short text'
    expect(truncateText(shortText, 20)).toBe('Short text')
  })

  it('handles null/undefined values', () => {
    expect(truncateText(null)).toBe(null)
    expect(truncateText(undefined)).toBe(undefined)
  })
})
