import React, { ReactElement, ReactNode } from 'react'
import { StatusBar } from 'react-native'
import styled from 'styled-components/native'

import theme from '../constants/theme'

interface Props {
  backgroundColor?: string
  lightStatusBarContent?: boolean
  children?: ReactNode
  shouldApplyFullscreen?: boolean
}

const Container = styled.SafeAreaView<{ backgroundColor: string; shouldApplyFullscreen: boolean }>`
  background-color: ${props => props.backgroundColor};
  flex: ${props => (props.shouldApplyFullscreen ? '1' : '0')};
`

const RouteWrapper = ({
  backgroundColor = theme.colors.background,
  lightStatusBarContent = false,
  children,
  shouldApplyFullscreen = true,
}: Props): ReactElement => (
  <Container backgroundColor={backgroundColor} shouldApplyFullscreen={shouldApplyFullscreen}>
    <StatusBar backgroundColor={backgroundColor} barStyle={lightStatusBarContent ? 'light-content' : 'dark-content'} />
    {children}
  </Container>
)

export default RouteWrapper
