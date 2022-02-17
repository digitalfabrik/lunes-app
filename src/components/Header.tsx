import React from 'react'
import styled from 'styled-components/native'

import { HeaderSquareIcon, HeaderStarIcon, HeaderCircleIcon, HeaderLinesIcon, LunesIcon } from '../../assets/images'

const Wrapper = styled.SafeAreaView`
  background-color: ${props => props.theme.colors.lunesBlack};
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
  margin-left: ${props => `-${props.theme.spacings.xl}`};
  top: 51px;
`

const Header = (): JSX.Element => (
  <Wrapper testID='header'>
    <HeaderStyle>
      <SquareIconStyle>
        <HeaderSquareIcon />
      </SquareIconStyle>
      <StarIconStyle>
        <HeaderStarIcon />
      </StarIconStyle>
      <CircleIconStyle>
        <HeaderCircleIcon />
      </CircleIconStyle>
      <VerticalLinesIcon>
        <HeaderLinesIcon />
      </VerticalLinesIcon>
      <SmileIconStyle>
        <LunesIcon />
      </SmileIconStyle>
    </HeaderStyle>
  </Wrapper>
)
export default Header
