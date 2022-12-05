import { COLORS } from './colors'
import { FONTS } from './fonts'
import { SPACINGS, SPACINGS_PLAIN } from './spacings'
import { STYLES } from './styles'

export type Theme = {
  colors: typeof COLORS
  fonts: typeof FONTS
  spacings: typeof SPACINGS
  spacingsPlain: typeof SPACINGS_PLAIN
  styles: typeof STYLES
}

const theme: Theme = {
  colors: COLORS,
  fonts: FONTS,
  spacings: SPACINGS,
  spacingsPlain: SPACINGS_PLAIN,
  styles: STYLES,
}

export default theme
