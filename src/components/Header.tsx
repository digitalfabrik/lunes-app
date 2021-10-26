import React from 'react'
import styled from 'styled-components/native'

import { SquareIcon, StarIcon, CircleIcon, LinesIcon, SmileIcon } from '../../assets/images'

const Wrapper = styled.View`
  background-color: ${props => props.theme.colors.lunesBlack};
  padding-top: ${(prop: IHeaderProps) => prop.top ?? 0}px;
`
const HeaderStyle = styled.View`
  background-color: ${props => props.theme.colors.lunesBlack};
  height: 91px;
  width: 100%;
`
const SquareIconStyle = styled.View`
  position: absolute;
  top: 41.5px;
  left: 24.3px;
  width: 28px;
  height: 28px;
`
const StarIconStyle = styled.View`
  position: absolute;
  top: -5px;
  left: 98.3px;
  width: 28px;
  height: 23.5px;
`
const CircleIconStyle = styled.View`
  position: absolute;
  top: 37.5px;
  right: 68.8px;
  width: 28px;
  height: 29px;
`
const VerticalLinesIcon = styled.View`
  position: absolute;
  top: 16.5px;
  right: 0px;
  width: 24.5px;
  height: 28px;
`
const SmileIconStyle = styled.View`
  position: absolute;
  width: 80px;
  height: 80px;
  left: 50%;
  margin-left: -40px;
  top: 51px;
`

export interface IHeaderProps {
  top: number | undefined
}

const Header = ({ top }: IHeaderProps): JSX.Element => (
  <Wrapper testID='header' top={top}>
    <HeaderStyle>
      <SquareIconStyle>
        <SquareIcon />
      </SquareIconStyle>
      <StarIconStyle>
        <StarIcon />
      </StarIconStyle>
      <CircleIconStyle>
        <CircleIcon />
      </CircleIconStyle>
      <VerticalLinesIcon>
        <LinesIcon />
      </VerticalLinesIcon>
      <SmileIconStyle>
        <SmileIcon />
      </SmileIconStyle>
    </HeaderStyle>
  </Wrapper>
)
export default Header
