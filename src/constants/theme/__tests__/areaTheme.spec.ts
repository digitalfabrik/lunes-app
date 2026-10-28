import theme from '..'

import { mockTelcArea } from '../../../testing/mockContentArea'
import getAreaTheme from '../areaTheme'
import { darkenUntilContrast, getContrastRatio } from '../contrast'

const MIN_TEXT_CONTRAST = 4.5

describe('getContrastRatio', () => {
  it('should be 21 between black and white', () => {
    expect(getContrastRatio('#000000', '#ffffff')).toBeCloseTo(21)
  })
})

describe('darkenUntilContrast', () => {
  it('should keep a color that already has enough contrast', () => {
    expect(darkenUntilContrast('#007dbe', '#ffffff', 3)).toBe('#007dbe')
  })

  it('should darken a light color until it has enough contrast', () => {
    const darkened = darkenUntilContrast('#a6e0ff', '#ffffff', 3)

    expect(darkened).not.toBe('#a6e0ff')
    expect(darkened).toMatch(/^#[0-9a-f]{6}$/)
    expect(getContrastRatio(darkened, '#ffffff')).toBeGreaterThanOrEqual(3)
  })

  it('should darken in steps of ten percent and stop at the first one with enough contrast', () => {
    expect(darkenUntilContrast('#ffffff', '#ffffff', 3)).toBe('#808080')
  })

  it('should keep a color that is not a hex color', () => {
    expect(darkenUntilContrast('red', '#ffffff', 3)).toBe('red')
  })
})

describe('getAreaTheme', () => {
  const telc = mockTelcArea()

  it('should leave the Lunes theme untouched without a content area', () => {
    expect(getAreaTheme(undefined)).toBe(theme)
  })

  it('should keep the Lunes colors if the area has no colors', () => {
    const { colors } = getAreaTheme({
      ...telc,
      primaryColor: undefined,
      learningColor: undefined,
      trainingColor: undefined,
    })

    expect(colors).toEqual(theme.colors)
  })

  describe('with the telc colors', () => {
    it('should use them for the header and the learning and training cards', () => {
      const { colors } = getAreaTheme(telc)

      expect(colors.backgroundHeader).toBe('#a01915')
      expect(colors.backgroundLearning).toBe('#007dbe')
      expect(colors.backgroundTraining).toBe('#027b91')
    })

    it('should keep the light text on them, as in the design', () => {
      const { colors } = getAreaTheme(telc)

      expect(colors.textOnHeader).toBe(theme.colors.textOnHeader)
      expect(colors.textOnLearningCard).toBe(theme.colors.textOnLearningCard)
      expect(colors.textOnTrainingCard).toBe(theme.colors.textOnTrainingCard)
    })

    it('should keep every other color, the fonts and the layout of Lunes', () => {
      const areaTheme = getAreaTheme(telc)

      expect(areaTheme.colors.primary).toBe(theme.colors.primary)
      expect(areaTheme.colors.background).toBe(theme.colors.background)
      expect(areaTheme.fonts).toBe(theme.fonts)
      expect(areaTheme.spacings).toBe(theme.spacings)
    })
  })

  describe('with a light color', () => {
    const light = { ...telc, primaryColor: '#ffff00', learningColor: '#f0f0f0', trainingColor: '#cccccc' }

    it('should still use the color', () => {
      const { colors } = getAreaTheme(light)

      expect(colors.backgroundHeader).toBe('#ffff00')
      expect(colors.backgroundLearning).toBe('#f0f0f0')
      expect(colors.backgroundTraining).toBe('#cccccc')
    })

    it('should show dark text on it that stays readable', () => {
      const { colors } = getAreaTheme(light)

      expect(colors.textOnHeader).toBe(theme.colors.black)
      expect(colors.textOnLearningCard).toBe(theme.colors.black)
      expect(colors.textOnLearningItem).toBe(theme.colors.black)
      expect(colors.textOnTrainingCard).toBe(theme.colors.black)
      expect(colors.textOnTrainingItem).toBe(theme.colors.black)
      expect(getContrastRatio(colors.textOnHeader, colors.backgroundHeader)).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST)
      expect(getContrastRatio(colors.textOnLearningCard, colors.backgroundLearning)).toBeGreaterThanOrEqual(
        MIN_TEXT_CONTRAST,
      )
      expect(getContrastRatio(colors.textOnTrainingCard, colors.backgroundTraining)).toBeGreaterThanOrEqual(
        MIN_TEXT_CONTRAST,
      )
    })
  })

  describe('with a color the area has not set', () => {
    it('should keep the Lunes color and text for just that place', () => {
      const { colors } = getAreaTheme({ ...telc, learningColor: undefined })

      expect(colors.backgroundLearning).toBe(theme.colors.backgroundLearning)
      expect(colors.textOnLearningCard).toBe(theme.colors.textOnLearningCard)
      expect(colors.textOnLearningItem).toBe(theme.colors.textOnLearningItem)
      expect(colors.backgroundHeader).toBe('#a01915')
      expect(colors.backgroundTraining).toBe('#027b91')
    })
  })
})
