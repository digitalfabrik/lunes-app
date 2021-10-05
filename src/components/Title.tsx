import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

const Container = styled.View`
  min-height: 54px;
  align-items: center;
  margin-bottom: 32px;
`

export interface ITitleProps {
  children: ReactElement
}

const Title = ({ children }: ITitleProps): ReactElement => <Container>{children}</Container>
export default Title
