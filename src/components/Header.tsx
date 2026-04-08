import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { HeaderSquareIcon, HeaderStarIcon, HeaderCircleIcon, HeaderLinesIcon, LunesIcon } from '../../assets/images'

const Wrapper = styled.View`
  background-color: ${props => props.theme.colors.primary};
`
const HeaderStyle = styled.View`
  background-color: ${props => props.theme.colors.primary};
  height: 92px;
  width: 100%;
`
const SquareIconStyle = styled.View`
  position: absolute;
  top: 40px;
  left: 20px;
  width: ${props => props.theme.sizes.defaultIcon}px;
  height: ${props => props.theme.sizes.defaultIcon}px;
`
const StarIconStyle = styled.View`
  position: absolute;
  top: -5px;
  left: 96px;
  width: ${props => props.theme.sizes.defaultIcon}px;
  height: 24px;
`
const CircleIconStyle = styled.View`
  position: absolute;
  top: 36px;
  right: 68px;
  width: ${props => props.theme.sizes.defaultIcon}px;
  height: ${props => props.theme.sizes.defaultIcon}px;
`
const VerticalLinesIcon = styled.View`
  position: absolute;
  top: 16px;
  right: 0px;
  width: 24px;
  height: ${props => props.theme.sizes.defaultIcon}px;
`

const SmileIconStyle = styled.Pressable`
  position: absolute;
  left: 50%;
  margin-left: -24px;
  top: 60px;
`

const Header = (): ReactElement => (
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
        <LunesIcon width={64} height={64} />
      </SmileIconStyle>
    </HeaderStyle>
  </Wrapper>
)

export default Header
