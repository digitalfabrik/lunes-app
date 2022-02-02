declare module '*.svg' {
  import React from 'react'
  import { SvgProps } from 'react-native-svg'

  const content: React.ComponentType<SvgProps>
  export default content
}

declare module '*.png' {
  const content: number
  export default content
}
