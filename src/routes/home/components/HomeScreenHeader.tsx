import { StackNavigationProp } from '@react-navigation/stack'
import React, { type JSX } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { LunesIcon, MenuIcon } from '../../../../assets/images'
import { RoutesParams } from '../../../navigation/NavigationTypes'

const Wrapper = styled.SafeAreaView`
  background-color: ${props => props.theme.colors.primary};
`
const HeaderStyle = styled.View`
  background-color: ${props => props.theme.colors.primary};
  height: ${hp('7%')}px;
  width: 100%;
`

const SmileIconStyle = styled.Pressable`
  position: absolute;
  left: 50%;
  margin-left: -${hp('3%')}px;
  top: 50%;
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

const HomeScreenHeader = ({ navigation }: HomeScreenHeaderProps): JSX.Element => (
  <Wrapper testID='header'>
    <HeaderStyle>
      <SmileIconStyle>
        <LunesIcon width={hp('8%')} height={hp('8%')} />
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
