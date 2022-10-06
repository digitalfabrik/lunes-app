import React from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { HeaderSquareIcon, HeaderStarIcon, HeaderCircleIcon, HeaderLinesIcon, LunesIcon } from '../../assets/images'

const Wrapper = styled.View`
  background-color: ${props => props.theme.colors.primary};
`
const HeaderStyle = styled.View`
  background-color: ${props => props.theme.colors.primary};
  height: ${hp('12.65%')}px;
  width: 100%;
`
const SquareIconStyle = styled.View`
  position: absolute;
  top: ${hp('5.5%')}px;
  left: ${hp('2.75%')}px;
  width: ${hp('3.85%')}px;
  height: ${hp('3.85%')}px;
`
const StarIconStyle = styled.View`
  position: absolute;
  top: -5px;
  left: ${hp('13.2%')}px;
  width: ${hp('3.85%')}px;
  height: ${hp('3.3%')}px;
`
const CircleIconStyle = styled.View`
  position: absolute;
  top: ${hp('4.95%')}px;
  right: ${hp('9.35%')}px;
  width: ${hp('3.85%')}px;
  height: ${hp('3.85%')}px;
`
const VerticalLinesIcon = styled.View`
  position: absolute;
  top: ${hp('2.2%')}px;
  right: 0px;
  width: ${hp('3.3%')}px;
  height: ${hp('3.85%')}px;
`

const SmileIconStyle = styled.Pressable`
  position: absolute;
  left: 50%;
  margin-left: -${hp('3.3%')}px;
  top: ${hp('8.25%')}px;
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
        <LunesIcon width={hp('8.8%')} height={hp('8.8%')} />
      </SmileIconStyle>
    </HeaderStyle>
  </Wrapper>
)

export default Header
