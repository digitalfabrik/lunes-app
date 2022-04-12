import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

const Line = styled.View`
  width: 100%;
  height: 1px;
  margin: ${props => props.theme.spacings.xs} auto;
  border: solid 1px ${props => props.theme.colors.disabled};
`

const HorizontalLine = (): ReactElement => <Line />

export default HorizontalLine
