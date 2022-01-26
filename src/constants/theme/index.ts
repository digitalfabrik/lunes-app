import { COLORS } from './colors'
import { FONTS } from './fonts'

export interface Theme {
  colors: typeof COLORS
  fonts: typeof FONTS
}

const theme: Theme = {
  colors: COLORS,
  fonts: FONTS
}

export default theme
