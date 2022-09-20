import React, { ReactElement, ReactNode } from 'react'
import { Modal as RNModal } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { CloseIcon } from '../../assets/images'
import PressableOpacity from './PressableOpacity'

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

const Icon = styled(PressableOpacity)`
  position: absolute;
  top: 8px;
  right: 8px;
  width: ${hp('3%')}px;
  height: ${hp('3%')}px;
`

interface PropsType {
  visible: boolean
  onClose: () => void
  testID?: string
  children: ReactNode
}

const ModalSkeleton = ({ visible, onClose, testID, children }: PropsType): ReactElement => (
  <RNModal testID={testID} visible={visible} transparent animationType='fade' onRequestClose={onClose}>
    <Overlay>
      <ModalContainer>
        <Icon onPress={onClose}>
          <CloseIcon width={hp('3%')} height={hp('3%')} />
        </Icon>
        {children}
      </ModalContainer>
    </Overlay>
  </RNModal>
)

export default ModalSkeleton
