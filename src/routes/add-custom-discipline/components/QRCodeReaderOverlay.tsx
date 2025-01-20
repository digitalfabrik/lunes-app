import React, { ReactElement } from 'react'
import { Camera, Code, useCameraDevice, useCodeScanner } from 'react-native-vision-camera'
import styled from 'styled-components/native'

import CameraOverlay from '../../../components/CameraOverlay'
import useAppState from '../../../hooks/useAppState'

const StyledCamera = styled(Camera)`
  flex: 1;
  position: relative;
`

type AddCustomDisciplineScreenProps = {
  setVisible: (visible: boolean) => void
  setCode: (code: string) => void
}

const AddCustomDisciplineScreen = ({ setVisible, setCode }: AddCustomDisciplineScreenProps): ReactElement | null => {
  const device = useCameraDevice('back')
  const onCodeScanned = (codes: Code[]) => {
    const code = codes[0]?.value
    if (code) {
      setCode(code)
      setVisible(false)
    }
  }
  const codeScanner = useCodeScanner({ codeTypes: ['qr'], onCodeScanned })
  const { inForeground } = useAppState()

  if (!device) {
    return null
  }

  return (
    <CameraOverlay setVisible={setVisible}>
      <StyledCamera isActive={inForeground} device={device} codeScanner={codeScanner} />
    </CameraOverlay>
  )
}

export default AddCustomDisciplineScreen
