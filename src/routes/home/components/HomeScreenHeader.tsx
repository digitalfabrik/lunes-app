import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { HiddenItem } from 'react-navigation-header-buttons'
import styled from 'styled-components/native'

import { LunesIcon, MenuIcon } from '../../../../assets/images'
import OverflowMenu from '../../../components/OverflowMenu'
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
const MenuIconContainer = styled.View`
  padding: ${props => props.theme.spacings.sm}
}

;
`

const MenuIconWhite = styled(MenuIcon)`
  color: ${props => props.theme.colors.backgroundAccent};
`

interface Props {
  navigation: StackNavigationProp<RoutesParams, keyof RoutesParams>
}

const HomeScreenHeader = ({ navigation }: Props): JSX.Element => (
  <Wrapper testID='header'>
    <HeaderStyle>
      <SmileIconStyle>
        <LunesIcon width={hp('8%')} height={hp('8%')} />
      </SmileIconStyle>
      <HeaderButtonsContainer>
        <OverflowMenu
          icon={
            <MenuIconContainer>
              <MenuIconWhite width={hp('3%')} height={hp('3%')} />
            </MenuIconContainer>
          }>
          <HiddenItem
            title={getLabels().general.header.manageSelection}
            onPress={() => navigation.navigate('ManageSelection')}
          />
          <HiddenItem title={getLabels().general.header.settings} onPress={() => navigation.navigate('Settings')} />
        </OverflowMenu>
      </HeaderButtonsContainer>
    </HeaderStyle>
  </Wrapper>
)

export default HomeScreenHeader
