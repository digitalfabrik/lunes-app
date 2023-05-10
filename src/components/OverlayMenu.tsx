import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useCallback, useEffect } from 'react'
import { Modal as RNModal } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { CloseIconWhite } from '../../assets/images'
import { RoutesParams } from '../navigation/NavigationTypes'

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
  setVisible: (visible: boolean) => void
  children: ReactElement[]
  navigation: StackNavigationProp<RoutesParams, keyof RoutesParams>
}

const OverlayMenu = ({ navigation, setVisible, children }: OverlayProps): ReactElement => {
  const onClose = useCallback(() => setVisible(false), [setVisible])
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => onClose())
    return unsubscribe
  }, [navigation, onClose])

  return (
    <RNModal visible transparent animationType='fade' onRequestClose={onClose}>
      <Container>
        <Icon onPress={onClose}>
          <CloseIconWhite testID='close-icon-white' />
        </Icon>
        {children}
      </Container>
    </RNModal>
  )
}

export default OverlayMenu
