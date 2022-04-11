import React from 'react'
import styled from 'styled-components/native'

import { LunesIcon, MenuIcon } from '../../assets/images'
import SentryTestPressable from './SentryTestPressable'

const Wrapper = styled.SafeAreaView`
  background-color: ${props => props.theme.colors.primary};
`
const HeaderStyle = styled.View`
  background-color: ${props => props.theme.colors.primary};
  height: 60px;
  width: 100%;
`

const SmileIconStyle = styled.Pressable`
  position: absolute;
  width: 80px;
  height: 80px;
  left: 50%;
  margin-left: -40px;
  top: 20px;
`

const MenuIconContainer = styled.Pressable`
  position: absolute;
  color: white;
  top: ${props => props.theme.spacings.sm};
  right: ${props => props.theme.spacings.sm};
`

const HeaderWithMenu = (): JSX.Element => (
  <Wrapper testID='header'>
    <HeaderStyle>
      <SmileIconStyle>
        <SentryTestPressable>
          <LunesIcon />
        </SentryTestPressable>
      </SmileIconStyle>
      <MenuIconContainer>
        <MenuIcon />
        {/* Will be done in LUN-276 */}
      </MenuIconContainer>
    </HeaderStyle>
  </Wrapper>
)

export default HeaderWithMenu
