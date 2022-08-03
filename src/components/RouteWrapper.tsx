import React, { ReactElement, ReactNode } from 'react'
import { Platform, StatusBar } from 'react-native'
import styled from 'styled-components/native'

import theme from '../constants/theme'

interface Props {
  backgroundColor?: string
  lightStatusBarContent?: boolean
  children: ReactNode
  shouldApplyToBottom?: boolean
}

const Container = styled.SafeAreaView<{ backgroundColor: string; shouldApplyToBottom: boolean }>`
  background-color: ${props => props.backgroundColor};
  flex: ${props => (props.shouldApplyToBottom ? '1' : '0')};
`

const RouteWrapper = ({
  backgroundColor = theme.colors.background,
  lightStatusBarContent = false,
  children,
  shouldApplyToBottom = true,
}: Props): ReactElement => (
  <>
    <Container backgroundColor={backgroundColor} shouldApplyToBottom>
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={lightStatusBarContent ? 'light-content' : 'dark-content'}
      />
      {children}
    </Container>
    {/* For iOS a separate container is needed to overwrite the color of the bottom notch */}
    {!shouldApplyToBottom && Platform.OS === 'ios' && (
      <Container shouldApplyToBottom={false} backgroundColor={theme.colors.background} />
    )}
  </>
)

export default RouteWrapper
