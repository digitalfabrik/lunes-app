import React, { ReactElement, ReactNode } from 'react'
import { Keyboard, Modal as RNModal, Platform, Pressable, ScrollView } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { CloseIcon } from '../../assets/images'
import useKeyboard from '../hooks/useKeyboard'
import { getLabels } from '../services/helpers'

const KEYBOARD_MARGIN = 16

const Overlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.overlay};
`

const ModalContainer = styled.View<{ bottomPosition?: number }>`
  background-color: ${props => props.theme.colors.backgroundAccent};
  width: 85%;
  border-radius: 4px;
  padding: ${props => props.theme.spacings.sm};
  ${props => (props.bottomPosition ? `position: absolute;bottom: ${props.bottomPosition + KEYBOARD_MARGIN}px` : '')}
`

const IconRow = styled.View`
  align-items: flex-end;
`

const StyledPressable = styled(Pressable)`
  flex: 1;
`

type ModalSkeletonProps = {
  visible: boolean
  onClose: () => void
  testID?: string
  children: ReactNode
}

const ModalSkeleton = ({ visible, onClose, testID, children }: ModalSkeletonProps): ReactElement => {
  const { keyboardHeight, isKeyboardVisible } = useKeyboard()
  const theme = useTheme()
  const handleBackdropPress = (): void => {
    if (isKeyboardVisible) {
      Keyboard.dismiss()
    } else {
      onClose()
    }
  }
  const isKeyboardIosVisible = Platform.OS === 'ios' && isKeyboardVisible

  return (
    <RNModal
      testID={testID}
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <StyledPressable onPress={handleBackdropPress} accessible={Platform.OS !== 'ios'}>
        <Overlay>
          <ModalContainer bottomPosition={isKeyboardIosVisible ? keyboardHeight : undefined}>
            <IconRow>
              <Pressable onPress={onClose} accessibilityRole='button' accessibilityLabel={getLabels().general.close}>
                <CloseIcon width={theme.spacingsPlain.md} height={theme.spacingsPlain.md} />
              </Pressable>
            </IconRow>
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
