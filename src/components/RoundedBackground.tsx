import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { Color } from '../constants/theme/colors'

const WIDTH_RATIO = 1.4

const RoundedBackgroundView = styled.View<{ color: string }>`
  width: ${WIDTH_RATIO * 100}%;
  background-color: ${props => props.color};
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
  padding-bottom: ${props => props.theme.spacings.md};
  margin-bottom: ${props => props.theme.spacings.xxl};
  align-items: center;
`

const RoundedBackgroundInner = styled.View`
  width: ${100 / WIDTH_RATIO}%;
  justify-content: center;
  align-items: center;
  text-align: center;
`

type RoundedBackgroundProps = {
  color: Color
  children: ReactElement[] | ReactElement
}
const RoundedBackground = ({ color, children }: RoundedBackgroundProps): ReactElement => (
  <RoundedBackgroundView color={color}>
    <RoundedBackgroundInner>{children}</RoundedBackgroundInner>
  </RoundedBackgroundView>
)

export default RoundedBackground
