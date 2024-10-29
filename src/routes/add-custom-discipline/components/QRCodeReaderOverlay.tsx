import { useIsFocused } from '@react-navigation/native'
import React, { ReactElement } from 'react'
import { Camera, Code, useCameraDevice, useCodeScanner } from 'react-native-vision-camera'
import styled from 'styled-components/native'

import CameraOverlay from '../../../components/CameraOverlay'

const StyledCamera = styled(Camera)`
  flex: 1;
  position: relative;
`

type AddCustomDisciplineScreenProps = {
  setVisible: (visible: boolean) => void
  setCode: (code: string) => void
}

const AddCustomDisciplineScreen = ({ setVisible, setCode }: AddCustomDisciplineScreenProps): ReactElement => {
  const device = useCameraDevice('back')
  const onCodeScanned = (codes: Code[]) => {
    const code = codes[0]?.value
    if (code) {
      setCode(code)
      setVisible(false)
    }
  }
  const codeScanner = useCodeScanner({ codeTypes: ['qr'], onCodeScanned })
  const isFocused = useIsFocused()

  return (
    <CameraOverlay setVisible={setVisible}>
      {device && <StyledCamera isActive={isFocused} device={device} codeScanner={codeScanner} />}
    </CameraOverlay>
  )
}

export default AddCustomDisciplineScreen
