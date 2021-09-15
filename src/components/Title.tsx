import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

const TitleStyle = styled.View`
    min-height: 54;
    align-items: center;
    margin-bottom: 32;
`;

export interface ITitleProps {
  children: ReactElement
}

const Title = ({ children }: ITitleProps) => <TitleStyle>{children}</TitleStyle>
export default Title