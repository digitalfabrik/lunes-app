import 'styled-components'

import { Theme } from '../constants/theme'

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
