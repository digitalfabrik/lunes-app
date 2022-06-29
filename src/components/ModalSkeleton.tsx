import React, { ReactElement, ReactNode } from 'react'
import { Modal } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { CloseIcon } from '../../assets/images'

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

interface PropsType {
  visible: boolean
  onClose: () => void
  testID?: string
  children: ReactNode
}

const ModalSkeleton = ({ visible, onClose, testID, children }: PropsType): ReactElement => (
  <Modal testID={testID} visible={visible} transparent animationType='fade' onRequestClose={onClose}>
    <Overlay>
      <ModalContainer>
        <Icon onPress={onClose}>
          <CloseIcon width={wp('6%')} height={wp('6%')} />
        </Icon>
        {children}
      </ModalContainer>
    </Overlay>
  </Modal>
)

export default ModalSkeleton
