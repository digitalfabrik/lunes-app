import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

const Padding = styled.View<{ bottom: number }>`
  padding: ${props => props.bottom}px;
`

const SafeBottomPadding = (): JSX.Element => {
  const insets = useSafeAreaInsets()

  return <Padding bottom={insets.bottom} />
}

export default SafeBottomPadding
