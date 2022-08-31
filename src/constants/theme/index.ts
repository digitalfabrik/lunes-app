import { COLORS } from './colors'
import { FONTS } from './fonts'
import { SPACINGS } from './spacings'
import { STYLES } from './styles'

export interface Theme {
  colors: typeof COLORS
  fonts: typeof FONTS
  spacings: typeof SPACINGS
  styles: typeof STYLES
}

const theme: Theme = {
  colors: COLORS,
  fonts: FONTS,
  spacings: SPACINGS,
  styles: STYLES,
}

export default theme
