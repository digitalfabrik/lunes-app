import 'styled-components'

import { Theme } from '../constants/theme'

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/consistent-type-definitions
  export interface DefaultTheme extends Theme {}
}
