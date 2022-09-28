import React, { ReactElement, ReactNode } from 'react'
import { Keyboard, Modal as RNModal, Platform, Pressable, ScrollView } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { CloseIcon } from '../../assets/images'
import useKeyboard from '../hooks/useKeyboard'
import useScreenHeight from '../hooks/useScreenHeight'
import PressableOpacity from './PressableOpacity'

const KEYBOARD_MARGIN = hp('2%')
const Overlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.overlay};
`
const ModalContainer = styled.View<{ bottomPosition?: number; height?: number }>`
  background-color: ${props => props.theme.colors.backgroundAccent};
  align-items: center;
  width: ${wp('85%')}px;
  border-radius: 4px;
  padding: ${props => props.theme.spacings.sm} 0;
  position: relative;
  ${props => (props.bottomPosition ? `position: absolute;bottom: ${props.bottomPosition + KEYBOARD_MARGIN}px` : '')}
`

const Icon = styled(PressableOpacity)`
  position: absolute;
  top: 8px;
  right: 8px;
  width: ${hp('3%')}px;
  height: ${hp('3%')}px;
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
  const screenHeight = useScreenHeight()
  const onCloseKeyboard = () => isKeyboardVisible && Keyboard.dismiss()
  const isKeyboardIosVisible = Platform.OS === 'ios' && isKeyboardVisible

  return (
    <RNModal testID={testID} visible={visible} transparent animationType='fade' onRequestClose={onClose}>
      <StyledPressable onPress={onCloseKeyboard}>
        <Overlay>
          <ModalContainer
            bottomPosition={isKeyboardIosVisible ? keyboardHeight : undefined}
            height={isKeyboardVisible ? screenHeight - keyboardHeight : undefined}>
            <Icon onPress={onClose}>
              <CloseIcon width={hp('6%')} height={hp('6%')} />
            </Icon>
            <ScrollView persistentScrollbar contentContainerStyle={{ alignItems: 'center' }}>
              {children}
            </ScrollView>
          </ModalContainer>
        </Overlay>
      </StyledPressable>
    </RNModal>
  )
}

export default ModalSkeleton
