import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { HeaderButtons, HiddenItem, OverflowMenu } from 'react-navigation-header-buttons'
import styled from 'styled-components/native'

import { LunesIcon, MenuIcon } from '../../assets/images'
import labels from '../constants/labels.json'
import { RoutesParams } from '../navigation/NavigationTypes'
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

const HeaderButtonsContainer = styled.View`
  align-self: flex-end;
`

const MenuIconContainer = styled.View`
  padding: ${props => props.theme.spacings.sm} ${props => props.theme.spacings.md};
`

interface Props {
  navigation: StackNavigationProp<RoutesParams, keyof RoutesParams>
}

const HeaderWithMenu = ({ navigation }: Props): JSX.Element => (
  <Wrapper testID='header'>
    <HeaderStyle>
      <SmileIconStyle>
        <SentryTestPressable>
          <LunesIcon />
        </SentryTestPressable>
      </SmileIconStyle>

      <HeaderButtonsContainer>
        <HeaderButtons>
          <OverflowMenu
            OverflowIcon={
              <MenuIconContainer>
                <MenuIcon />
              </MenuIconContainer>
            }>
            <HiddenItem
              title={labels.general.header.manageDisciplines}
              onPress={() => navigation.navigate('ManageDisciplines')}
            />
          </OverflowMenu>
        </HeaderButtons>
      </HeaderButtonsContainer>
    </HeaderStyle>
  </Wrapper>
)

export default HeaderWithMenu
