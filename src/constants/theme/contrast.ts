export const HEX_COLOR_PATTERN = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i
const HEX_RADIX = 16
const DARKENING_STEPS = 10

// WCAG minimum for large text and for interface components, see
// https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html and
// https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html
export const MIN_CONTRAST_RATIO = 3
const MAX_CHANNEL_VALUE = 255

// Formulas and values from https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html#dfn-relative-luminance
const SRGB_LINEAR_THRESHOLD = 0.04045
const SRGB_LINEAR_DIVISOR = 12.92
const SRGB_CURVE_OFFSET = 0.055
const SRGB_CURVE_DIVISOR = 1.055
const SRGB_CURVE_EXPONENT = 2.4

const RED_LUMINANCE_WEIGHT = 0.2126
const GREEN_LUMINANCE_WEIGHT = 0.7152
const BLUE_LUMINANCE_WEIGHT = 0.0722

// https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html#dfn-contrast-ratio
const CONTRAST_RATIO_OFFSET = 0.05

const toLinearChannel = (channel: string): number => {
  const value = parseInt(channel, HEX_RADIX) / MAX_CHANNEL_VALUE
  if (value <= SRGB_LINEAR_THRESHOLD) {
    return value / SRGB_LINEAR_DIVISOR
  }
  return ((value + SRGB_CURVE_OFFSET) / SRGB_CURVE_DIVISOR) ** SRGB_CURVE_EXPONENT
}

const getRelativeLuminance = (color: string): number => {
  const [, red = '00', green = '00', blue = '00'] = HEX_COLOR_PATTERN.exec(color) ?? []
  return (
    RED_LUMINANCE_WEIGHT * toLinearChannel(red) +
    GREEN_LUMINANCE_WEIGHT * toLinearChannel(green) +
    BLUE_LUMINANCE_WEIGHT * toLinearChannel(blue)
  )
}

export const getContrastRatio = (firstColor: string, secondColor: string): number => {
  const luminances = [getRelativeLuminance(firstColor), getRelativeLuminance(secondColor)]
  const lighter = Math.max(...luminances)
  const darker = Math.min(...luminances)
  return (lighter + CONTRAST_RATIO_OFFSET) / (darker + CONTRAST_RATIO_OFFSET)
}

const toHexChannel = (channel: number): string => Math.round(channel).toString(HEX_RADIX).padStart(2, '0')

export const darkenUntilContrast = (color: string, backgroundColor: string, minContrastRatio: number): string => {
  const match = HEX_COLOR_PATTERN.exec(color)
  if (match === null) {
    return color
  }
  const channels = match.slice(1).map(channel => parseInt(channel, HEX_RADIX))
  for (let step = 0; step <= DARKENING_STEPS; step += 1) {
    const brightness = 1 - step / DARKENING_STEPS
    const darkened = `#${channels.map(channel => toHexChannel(channel * brightness)).join('')}`
    if (getContrastRatio(darkened, backgroundColor) >= minContrastRatio) {
      return darkened
    }
  }
  return color
}
