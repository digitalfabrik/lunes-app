import { COLORS } from './colors'
import { FONTS } from './fonts'

export interface ThemeType {
  colors: typeof COLORS
  fonts: typeof FONTS
}

const theme: ThemeType = {
  colors: COLORS,
  fonts: FONTS
}

export default theme
