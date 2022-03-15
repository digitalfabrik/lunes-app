import React from 'react'
import { Modal } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { CloseIcon } from '../../assets/images'
import { BUTTONS_THEME } from '../constants/data'
import Button from './Button'
import { HeadingText } from './text/Heading'

const Overlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.overlay};
`
const ModalContainer = styled.View`
  background-color: ${props => props.theme.colors.backgroundAccent};
  align-items: center;
  width: ${wp('85%')}px;
  border-radius: 4px;
  position: relative;
  padding-top: ${props => props.theme.spacings.lg};
  padding-bottom: ${props => props.theme.spacings.lg};
`
const Icon = styled.TouchableOpacity`
  position: absolute;
  top: 8px;
  right: 8px;
  width: ${wp('6%')}px;
  height: ${wp('6%')}px;
`
const Message = styled(HeadingText)`
  width: ${wp('60%')}px;
  margin-bottom: ${props => props.theme.spacings.lg};
  padding-top: ${props => props.theme.spacings.lg};
  text-align: center;
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
    <Modal testID='modal' visible={visible} transparent animationType='fade' onRequestClose={() => setVisible(false)}>
      <Overlay>
        <ModalContainer>
          <Icon onPress={closeModal}>
            <CloseIcon width={wp('6%')} height={wp('6%')} />
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
