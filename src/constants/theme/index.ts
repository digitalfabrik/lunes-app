import { COLORS } from './colors'
import { FONTS } from './fonts'
import { SPACINGS, SPACINGS_PLAIN } from './spacings'

export interface Theme {
  colors: typeof COLORS
  fonts: typeof FONTS
  spacings: typeof SPACINGS
  spacingsPlain: typeof SPACINGS_PLAIN
}

const theme: Theme = {
  colors: COLORS,
  fonts: FONTS,
  spacings: SPACINGS,
  spacingsPlain: SPACINGS_PLAIN,
}

export default theme
