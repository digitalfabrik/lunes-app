import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { LunesIcon, MenuIcon } from '../../../../assets/images'
import { RoutesParams } from '../../../navigation/NavigationTypes'

const Wrapper = styled.View`
  background-color: ${props => props.theme.colors.primary};
`
const HeaderStyle = styled.View`
  background-color: ${props => props.theme.colors.primary};
  height: 56px;
  width: 100%;
`

const SmileIconStyle = styled.Pressable`
  position: absolute;
  align-self: center;
  bottom: -${props => props.theme.spacings.xxl};
`

const HeaderButtonsContainer = styled.View`
  align-self: flex-end;
`
const MenuIconContainer = styled.TouchableOpacity`
  padding: ${props => props.theme.spacings.sm} ${props => props.theme.spacings.xxs};
  justify-content: center;
  height: 100%;
`

const MenuIconWhite = styled(MenuIcon)`
  padding: 0 ${props => props.theme.spacings.md};
  color: ${props => props.theme.colors.backgroundAccent};
`

type HomeScreenHeaderProps = {
  navigation: StackNavigationProp<RoutesParams, keyof RoutesParams>
}

const HomeScreenHeader = ({ navigation }: HomeScreenHeaderProps): ReactElement => (
  <Wrapper testID='header'>
    <HeaderStyle>
      <SmileIconStyle>
        <LunesIcon width={96} height={96} />
      </SmileIconStyle>
      <HeaderButtonsContainer>
        <MenuIconContainer onPress={() => navigation.navigate('OverlayMenu')}>
          <MenuIconWhite testID='menu-icon-white' />
        </MenuIconContainer>
      </HeaderButtonsContainer>
    </HeaderStyle>
  </Wrapper>
)

export default HomeScreenHeader
