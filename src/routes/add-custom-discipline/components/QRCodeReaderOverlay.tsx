import React, { ReactElement } from 'react'
import { BarCodeReadEvent, RNCamera } from 'react-native-camera'
import styled from 'styled-components/native'

import CameraOverlay from '../../../components/CameraOverlay'

const Camera = styled(RNCamera)`
  flex: 1;
  position: relative;
`

interface AddCustomDisciplineScreenProps {
  setVisible: (visible: boolean) => void
  setCode: (code: string) => void
}

const AddCustomDisciplineScreen = ({ setVisible, setCode }: AddCustomDisciplineScreenProps): ReactElement => {
  const onBarCodeRead = (scanResult: BarCodeReadEvent) => {
    setCode(scanResult.data)
    setVisible(false)
  }

  return (
    <CameraOverlay setVisible={setVisible}>
      <Camera captureAudio={false} onBarCodeRead={onBarCodeRead} testID='camera' />
    </CameraOverlay>
  )
}

export default AddCustomDisciplineScreen
