import React, { ReactElement } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { CloseIconWhite } from '../../assets/images'

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
}

const OverlayMenu = ({ setVisible, children }: OverlayProps): ReactElement => (
  <Container>
    <Icon onPress={() => setVisible(false)}>
      <CloseIconWhite testID='close-icon-white' />
    </Icon>
    {children}
  </Container>
)

export default OverlayMenu
