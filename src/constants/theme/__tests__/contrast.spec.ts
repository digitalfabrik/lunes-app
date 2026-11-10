import { darkenUntilContrast, getContrastRatio, isHexColor, MIN_CONTRAST_RATIO } from '../contrast'

describe('isHexColor', () => {
  it('should accept a six digit hex color in any case', () => {
    expect(isHexColor('#007dbe')).toBe(true)
    expect(isHexColor('#A6E0FF')).toBe(true)
  })

  it.each(['red', 'rgb(0, 125, 190)', 'rgba(0, 0, 0, 0.5)', '#fff', '#12345', '007dbe', ''])(
    'should reject %p',
    color => {
      expect(isHexColor(color)).toBe(false)
    },
  )
})

describe('getContrastRatio', () => {
  it('should be 21 between black and white', () => {
    expect(getContrastRatio('#000000', '#ffffff')).toBeCloseTo(21)
  })
})

describe('darkenUntilContrast', () => {
  it('should keep a color that already has enough contrast', () => {
    expect(darkenUntilContrast('#007dbe', '#ffffff', MIN_CONTRAST_RATIO)).toBe('#007dbe')
  })

  it('should darken a light color until it has enough contrast', () => {
    const darkened = darkenUntilContrast('#a6e0ff', '#ffffff', MIN_CONTRAST_RATIO)

    expect(darkened).not.toBe('#a6e0ff')
    expect(darkened).toMatch(/^#[0-9a-f]{6}$/)
    expect(getContrastRatio(darkened, '#ffffff')).toBeGreaterThanOrEqual(MIN_CONTRAST_RATIO)
  })

  it('should darken in steps of ten percent and stop at the first one with enough contrast', () => {
    expect(darkenUntilContrast('#ffffff', '#ffffff', MIN_CONTRAST_RATIO)).toBe('#808080')
  })

  it('should keep a color that is not a hex color', () => {
    expect(darkenUntilContrast('red', '#ffffff', MIN_CONTRAST_RATIO)).toBe('red')
  })

  it('should keep a color if the background is not a hex color', () => {
    expect(darkenUntilContrast('#a6e0ff', 'rgba(0, 0, 0, 0.5)', MIN_CONTRAST_RATIO)).toBe('#a6e0ff')
  })
})
