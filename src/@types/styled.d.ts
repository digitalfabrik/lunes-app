import 'styled-components'

import { Theme } from '../constants/theme'

declare module 'styled-components/native' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface,@typescript-eslint/consistent-type-definitions,@typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}
