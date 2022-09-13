import React, { ReactElement, ReactNode } from 'react'
import { Keyboard, Modal as RNModal, Platform, Pressable, ScrollView } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
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
const ModalContainer = styled.View<{ bottomPosition: number; height?: number; isKeyboardVisible: boolean }>`
  background-color: ${props => props.theme.colors.backgroundAccent};
  align-items: center;
  width: ${wp('85%')}px;
  border-radius: 4px;
  position: ${props => (props.isKeyboardVisible ? 'absolute' : 'relative')};
  padding: ${props => props.theme.spacings.sm} 0;
  bottom: ${props => props.bottomPosition + KEYBOARD_MARGIN}px;
  ${props => (props.height ? `max-height: ${props.height}px` : '')}
`

const Icon = styled(PressableOpacity)`
  position: relative;
  align-self: flex-end;
  margin-right: ${props => props.theme.spacings.sm};
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
  const screenHeight = useScreenHeight()
  const onCloseKeyboard = () => isKeyboardVisible && Keyboard.dismiss()

  return (
    <RNModal testID={testID} visible={visible} transparent animationType='fade' onRequestClose={onClose}>
      <StyledPressable onPress={onCloseKeyboard}>
        <Overlay>
          <ModalContainer
            isKeyboardVisible={isKeyboardVisible}
            bottomPosition={Platform.OS === 'ios' ? keyboardHeight : 0}
            height={isKeyboardVisible ? screenHeight - keyboardHeight : undefined}>
            <Icon onPress={onClose}>
              <CloseIcon width={wp('6%')} height={wp('6%')} />
            </Icon>
            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>{children}</ScrollView>
          </ModalContainer>
        </Overlay>
      </StyledPressable>
    </RNModal>
  )
}

export default ModalSkeleton
