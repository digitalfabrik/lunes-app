import React from 'react'
import { Modal } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { CloseIcon } from '../../assets/images'
import { BUTTONS_THEME } from '../constants/data'
import Button from './Button'

const Overlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.lunesOverlay};
`
const ModalContainer = styled.View`
  background-color: ${props => props.theme.colors.white};
  align-items: center;
  width: ${wp('85%')}px;
  border-radius: 4px;
  position: relative;
  padding-top: 31px;
  padding-bottom: 31px;
`
const Icon = styled.TouchableOpacity`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
`
const Message = styled.Text`
  text-align: center;
  font-size: ${props => props.theme.fonts.headingFontSize};
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.contentFontBold};
  width: ${wp('60%')}px;
  margin-bottom: 31px;
  padding-top: 31px;
`

export interface ConfirmationModalProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  text: string
  confirmationButtonText: string
  cancelButtonText: string
  confirmationAction: () => void
}

const ConfirmationModal = (props: ConfirmationModalProps): JSX.Element => {
  const { visible, setVisible, text, confirmationButtonText, cancelButtonText, confirmationAction } = props
  const closeModal = (): void => setVisible(false)

  return (
    <Modal testID='modal' visible={visible} transparent animationType='fade'>
      <Overlay>
        <ModalContainer>
          <Icon onPress={closeModal}>
            <CloseIcon />
          </Icon>
          <Message>{text}</Message>
          <Button label={cancelButtonText} onPress={closeModal} buttonTheme={BUTTONS_THEME.contained} />
          <Button label={confirmationButtonText} onPress={confirmationAction} buttonTheme={BUTTONS_THEME.outlined} />
        </ModalContainer>
      </Overlay>
    </Modal>
  )
}
export default ConfirmationModal
