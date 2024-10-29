import React, { ReactElement, ReactNode, useState } from 'react'
import { Modal as RNModal } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { CloseCircleIconBlue, CloseCircleIconWhite } from '../../assets/images'

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`

const Icon = styled.Pressable`
  align-self: flex-end;
  margin: ${props => `${props.theme.spacings.xs} ${props.theme.spacings.sm}`};
  width: ${hp('3.5%')}px;
  height: ${hp('3.5%')}px;
`

type Props = {
  setVisible: (visible: boolean) => void
  children: ReactNode
}

const CameraOverlay = ({ setVisible, children }: Props): ReactElement => {
  const [isPressed, setIsPressed] = useState<boolean>(false)

  return (
    <RNModal visible transparent animationType='fade' onRequestClose={() => setVisible(false)}>
      <Container>
        <Icon
          onPress={() => setVisible(false)}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}>
          {isPressed ? (
            <CloseCircleIconBlue testID='close-circle-icon-blue' width={hp('3.5%')} height={hp('3.5%')} />
          ) : (
            <CloseCircleIconWhite testID='close-circle-icon-white' width={hp('3.5%')} height={hp('3.5%')} />
          )}
        </Icon>
        {children}
      </Container>
    </RNModal>
  )
}

export default CameraOverlay
