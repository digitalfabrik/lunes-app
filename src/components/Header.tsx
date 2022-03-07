import React, { useState } from 'react'
import styled from 'styled-components/native'

import { HeaderSquareIcon, HeaderStarIcon, HeaderCircleIcon, HeaderLinesIcon, LunesIcon } from '../../assets/images'
import { reportError } from '../services/sentry'

const Wrapper = styled.SafeAreaView`
  background-color: ${props => props.theme.colors.primary};
`
const HeaderStyle = styled.View`
  background-color: ${props => props.theme.colors.primary};
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
const SmileIconStyle = styled.Pressable`
  position: absolute;
  width: 80px;
  height: 80px;
  left: 50%;
  margin-left: -40px;
  top: 51px;
`

const Header = (): JSX.Element => {
  const [counter, setCounter] = useState<number>(0)
  const CLICKS_TO_ENABLE_SENTRY = 20

  const onPress = () => {
    if (counter > CLICKS_TO_ENABLE_SENTRY) {
      reportError('Error for testing Sentry')
    }
    setCounter(oldVal => oldVal + 1)
  }

  return (
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
        <SmileIconStyle onPress={onPress}>
          <LunesIcon />
        </SmileIconStyle>
      </HeaderStyle>
    </Wrapper>
  )
}

export default Header
