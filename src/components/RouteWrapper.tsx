import React, { ReactElement, ReactNode } from 'react'
import { Platform, StatusBar } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import theme from '../constants/theme'

type RouteWrapperProps = {
  backgroundColor?: string
  lightStatusBarContent?: boolean
  children: ReactNode
  /** Separate bgColor for notches only works for ios */
  bottomBackgroundColor?: string
  shouldSetBottomInset?: boolean
  shouldSetTopInset?: boolean
}

const Container = styled.SafeAreaView<{
  backgroundColor: string
  shouldTakeSpace: boolean
  bottomInset?: number
  topInset?: number
}>`
  background-color: ${props => props.backgroundColor};
  flex: ${props => (props.shouldTakeSpace ? '1' : '0')};
  ${props => (props.topInset ? `padding-top: ${props.topInset}px` : undefined)};
  ${props => (props.bottomInset ? `padding-bottom: ${props.bottomInset}px` : undefined)};
`

const RouteWrapper = ({
  backgroundColor = theme.colors.background,
  lightStatusBarContent = false,
  children,
  bottomBackgroundColor,
  shouldSetBottomInset = false,
  shouldSetTopInset = false,
}: RouteWrapperProps): ReactElement => {
  const insets = useSafeAreaInsets()
  return (
    <>
      <Container
        backgroundColor={backgroundColor}
        shouldTakeSpace
        bottomInset={shouldSetBottomInset ? insets.bottom : undefined}
        topInset={shouldSetTopInset ? insets.top : undefined}>
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
}
export default RouteWrapper
