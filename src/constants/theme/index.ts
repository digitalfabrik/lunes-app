import ANIMATIONS from './animations'
import { COLORS } from './colors'
import { FONTS } from './fonts'
import SIZES from './sizes'
import { SPACINGS, SPACINGS_PLAIN } from './spacings'
import { STYLES } from './styles'

export type Theme = typeof theme

const theme = {
  animations: ANIMATIONS,
  colors: COLORS,
  fonts: FONTS,
  spacings: SPACINGS,
  spacingsPlain: SPACINGS_PLAIN,
  sizes: SIZES,
  styles: STYLES,
} as const

export default theme
