import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { LunesIcon, MenuIcon } from '../../../../assets/images'
import OverlayMenu, { OverlayMenuSeparator } from '../../../components/OverlayMenu'
import OverlayMenuItem from '../../../components/OverlayMenuItem'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { getLabels } from '../../../services/helpers'

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

const HomeScreenHeader = ({ navigation }: HomeScreenHeaderProps): JSX.Element => {
  const [overlayVisible, setOverlayVisible] = useState(false)

  if (overlayVisible) {
    return (
      <OverlayMenu setVisible={setOverlayVisible} navigation={navigation}>
        <OverlayMenuItem
          title={getLabels().general.header.manageSelection}
          onPress={() => navigation.navigate('ManageSelection')}
        />
        <OverlayMenuSeparator />
        <OverlayMenuItem
          isSubItem
          title={getLabels().general.header.sponsors}
          onPress={() => navigation.navigate('Sponsors')}
        />
        <OverlayMenuItem
          isSubItem
          title={getLabels().general.header.settings}
          onPress={() => navigation.navigate('Settings')}
        />
        <OverlayMenuItem
          isSubItem
          title={getLabels().general.header.impressum}
          onPress={() => navigation.navigate('Imprint')}
        />
      </OverlayMenu>
    )
  }

  return (
    <Wrapper testID='header'>
      <HeaderStyle>
        <SmileIconStyle>
          <LunesIcon width={hp('8%')} height={hp('8%')} />
        </SmileIconStyle>
        <HeaderButtonsContainer>
          <MenuIconContainer onPress={() => setOverlayVisible(true)}>
            <MenuIconWhite testID='menu-icon-white' />
          </MenuIconContainer>
        </HeaderButtonsContainer>
      </HeaderStyle>
    </Wrapper>
  )
}

export default HomeScreenHeader
