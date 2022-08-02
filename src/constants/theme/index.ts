import { COLORS } from './colors'
import { FONTS } from './fonts'
import { SPACINGS } from './spacings'

export interface Theme {
  colors: typeof COLORS
  fonts: typeof FONTS
  spacings: typeof SPACINGS
}

const theme: Theme = {
  colors: COLORS,
  fonts: FONTS,
  spacings: SPACINGS,
}

export default theme
