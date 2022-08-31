import React, { ReactElement, ReactNode } from 'react'
import { Keyboard, Modal as RNModal, Pressable } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { CloseIcon } from '../../assets/images'
import { useKeyboard } from '../hooks/useKeyboard'
import PressableOpacity from './PressableOpacity'

const KEYBOARD_MARGIN = hp('2%')
const Overlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.overlay};
`
const ModalContainer = styled.View<{ bottomPosition: number }>`
  background-color: ${props => props.theme.colors.backgroundAccent};
  align-items: center;
  width: ${wp('85%')}px;
  border-radius: 4px;
  position: ${props => (props.bottomPosition ? 'absolute' : 'relative')};
  padding-top: ${props => props.theme.spacings.lg};
  padding-bottom: ${props => props.theme.spacings.lg};
  bottom: ${props => props.bottomPosition + KEYBOARD_MARGIN}px;
  max-height: ${hp('60%')}px;
`

const Icon = styled(PressableOpacity)`
  position: absolute;
  top: 8px;
  right: 8px;
  width: ${wp('6%')}px;
  height: ${wp('6%')}px;
`

const StyledPressable = styled(Pressable)`
  flex: 1;
`

interface PropsType {
  visible: boolean
  onClose: () => void
  testID?: string
  children: ReactNode
}

const ModalSkeleton = ({ visible, onClose, testID, children }: PropsType): ReactElement => {
  const { keyboardHeight, isKeyboardVisible } = useKeyboard()
  const onCloseKeyboard = () => isKeyboardVisible && Keyboard.dismiss()

  return (
    <RNModal testID={testID} visible={visible} transparent animationType='fade' onRequestClose={onClose}>
      <StyledPressable onPress={onCloseKeyboard}>
        <Overlay>
          <ModalContainer bottomPosition={keyboardHeight}>
            <Icon onPress={onClose}>
              <CloseIcon width={wp('6%')} height={wp('6%')} />
            </Icon>
            {children}
          </ModalContainer>
        </Overlay>
      </StyledPressable>
    </RNModal>
  )
}

export default ModalSkeleton
