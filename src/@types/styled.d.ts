import 'styled-components'

import { ThemeType } from '../constants/theme'

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
