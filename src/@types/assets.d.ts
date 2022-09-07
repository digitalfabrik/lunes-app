declare module '*.svg' {
  import { ComponentType } from 'react'
  import { SvgProps } from 'react-native-svg'

  const content: ComponentType<SvgProps>
  export default content
}

declare module '*.png' {
  const content: number
  export default content
}
