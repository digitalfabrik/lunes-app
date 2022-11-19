import React, { ReactElement, ReactNode } from 'react'
import { Platform, StatusBar } from 'react-native'
import styled from 'styled-components/native'

import theme from '../constants/theme'

interface RouteWrapperProps {
  backgroundColor?: string
  lightStatusBarContent?: boolean
  children: ReactNode
  /** Separate bgColor for notches only works for ios */
  bottomBackgroundColor?: string
}

const Container = styled.SafeAreaView<{ backgroundColor: string; shouldTakeSpace: boolean }>`
  background-color: ${props => props.backgroundColor};
  flex: ${props => (props.shouldTakeSpace ? '1' : '0')};
`

const RouteWrapper = ({
  backgroundColor = theme.colors.background,
  lightStatusBarContent = false,
  children,
  bottomBackgroundColor,
}: RouteWrapperProps): ReactElement => (
  <>
    <Container backgroundColor={backgroundColor} shouldTakeSpace>
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={lightStatusBarContent ? 'light-content' : 'dark-content'}
      />
      {children}
    </Container>
    {/* For iOS a separate container is needed to overwrite the color of the bottom notch */}
    {bottomBackgroundColor && Platform.OS === 'ios' ? (
      <Container shouldTakeSpace={false} backgroundColor={bottomBackgroundColor} testID='hiddenContainer' />
    ) : null}
  </>
)

export default RouteWrapper
