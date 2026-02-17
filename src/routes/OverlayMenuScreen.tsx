import { CardStyleInterpolators, StackNavigationOptions, StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { CloseIconWhite } from '../../assets/images'
import OverlayMenuItem from '../components/OverlayMenuItem'
import { RoutesParams } from '../navigation/NavigationTypes'
import { getLabels } from '../services/helpers'

const OverlayContainer = styled.View`
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.colors.text}4D;
`

const Container = styled.View`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
`

const DismissArea = styled.Pressable`
  height: 100%;
  flex: 1;
`

const Sidebar = styled.SafeAreaView<{ paddingTop: number }>`
  height: 100%;
  width: 80%;
  padding-top: ${props => props.paddingTop}px;
  align-self: flex-end;
  background-color: ${props => props.theme.colors.primary};
`
const Icon = styled.Pressable`
  align-self: flex-end;
  margin: ${props => `${props.theme.spacings.xs} ${props.theme.spacings.sm}`};
  width: ${hp('5%')}px;
  height: ${hp('5%')}px;
`

export const OverlayTransition: StackNavigationOptions = {
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  cardOverlayEnabled: true,
  cardOverlay: () => <OverlayContainer />,
}

type OverlayProps = {
  navigation: StackNavigationProp<RoutesParams>
}

const OverlayMenu = ({ navigation }: OverlayProps): ReactElement => {
  const insets = useSafeAreaInsets()

  return (
    <Container>
      <DismissArea onPress={navigation.goBack} style={{ height: '100%', flex: 1 }} />
      <Sidebar paddingTop={insets.top}>
        <Icon onPress={navigation.goBack}>
          <CloseIconWhite testID='close-icon-white' />
        </Icon>
        <OverlayMenuItem
          isSubItem
          title={getLabels().general.header.sponsors}
          onPress={() =>
            navigation.navigate('BottomTabNavigator', { screen: 'HomeTab', params: { screen: 'Sponsors' } })
          }
        />
        <OverlayMenuItem
          isSubItem
          title={getLabels().general.header.settings}
          onPress={() =>
            navigation.navigate('BottomTabNavigator', { screen: 'HomeTab', params: { screen: 'Settings' } })
          }
        />
        <OverlayMenuItem
          isSubItem
          title={getLabels().general.header.impressum}
          onPress={() =>
            navigation.navigate('BottomTabNavigator', { screen: 'HomeTab', params: { screen: 'Imprint' } })
          }
        />
      </Sidebar>
    </Container>
  )
}

export default OverlayMenu
