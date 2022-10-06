import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { HiddenItem } from 'react-navigation-header-buttons'
import styled, { useTheme } from 'styled-components/native'

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
  padding: ${props => props.theme.spacings.sm} 0;
`

const MenuIconWhite = styled(MenuIcon)`
  color: ${props => props.theme.colors.backgroundAccent};
`

interface HomeScreenHeaderProps {
  navigation: StackNavigationProp<RoutesParams, keyof RoutesParams>
}

const HomeScreenHeader = ({ navigation }: HomeScreenHeaderProps): JSX.Element => {
  const theme = useTheme()
  return (
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
              titleStyle={{ fontSize: hp('2%') }}
              title={getLabels().general.header.manageSelection}
              onPress={() => navigation.navigate('ManageSelection')}
              // iOS has issue using styled(HiddenItem)
              style={{ height: theme.spacingsPlain.xl }}
            />
            <HiddenItem
              title={getLabels().general.header.settings}
              onPress={() => navigation.navigate('Settings')}
              titleStyle={{ fontSize: hp('2%') }}
              style={{ height: theme.spacingsPlain.xl }}
            />
          </OverflowMenu>
        </HeaderButtonsContainer>
      </HeaderStyle>
    </Wrapper>
  )
}

export default HomeScreenHeader
