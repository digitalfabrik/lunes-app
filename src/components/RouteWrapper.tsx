import React, { ReactElement, ReactNode } from 'react'
import { StatusBar, StatusBarStyle } from 'react-native'
import styled from 'styled-components/native'

import theme from '../constants/theme'

interface Props {
  backgroundColor?: string
  barStyle?: StatusBarStyle
  children?: ReactNode
  separated?: boolean
}

const Container = styled.SafeAreaView<{ backgroundColor: string; separated: boolean }>`
  background-color: ${props => props.backgroundColor};
  flex: ${props => (props.separated ? '0' : '1')};
`

const RouteWrapper = ({
  backgroundColor = theme.colors.background,
  barStyle = 'dark-content',
  children,
  separated = false
}: Props): ReactElement => (
  <Container backgroundColor={backgroundColor} separated={separated}>
    <StatusBar backgroundColor={backgroundColor} barStyle={barStyle} />
    {children}
  </Container>
)

export default RouteWrapper
