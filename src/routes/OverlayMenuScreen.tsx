import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { CloseIconWhite } from '../../assets/images'
import OverlayMenuItem from '../components/OverlayMenuItem'
import { RoutesParams } from '../navigation/NavigationTypes'
import { getLabels } from '../services/helpers'

export const OverlayMenuSeparator = styled.View`
  height: 2px;
  border-radius: 20px;
  background-color: ${props => props.theme.colors.backgroundAccent};
  margin: ${props => props.theme.spacings.sm};
`

const Container = styled.SafeAreaView`
  height: 100%;
  background-color: ${props => props.theme.colors.primary};
`
const Icon = styled.Pressable`
  align-self: flex-end;
  margin: ${props => `${props.theme.spacings.xs} ${props.theme.spacings.sm}`};
  width: ${hp('5%')}px;
  height: ${hp('5%')}px;
`

type OverlayProps = {
  navigation: StackNavigationProp<RoutesParams, keyof RoutesParams>
}

const OverlayMenu = ({ navigation }: OverlayProps): ReactElement => (
  <Container>
    <Icon onPress={() => navigation.goBack()}>
      <CloseIconWhite testID='close-icon-white' />
    </Icon>
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
  </Container>
)

export default OverlayMenu
