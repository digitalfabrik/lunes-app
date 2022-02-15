import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { AppState, Linking, Modal, PermissionsAndroid } from 'react-native'
import { BarCodeReadEvent, RNCamera } from 'react-native-camera'
import styled from 'styled-components/native'

import { CloseCircleIconBlue, CloseCircleIconWhite } from '../../../../assets/images'
import Button from '../../../components/Button'
import { BUTTONS_THEME } from '../../../constants/data'
import labels from '../../../constants/labels.json'
import NotAuthorisedView from './NotAuthorisedView'

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.white};
`

const Icon = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
`

const Camera = styled(RNCamera)`
  flex: 1;
  position: relative;
  margin: 50px 0 0;
`

interface Props {
  setVisible: (input: boolean) => void
  setCode: (input: string) => void
}

const AddCustomDisciplineScreen = ({ setVisible, setCode }: Props): ReactElement => {
  const appState = useRef(AppState.currentState)

  const [isPressed, setIsPressed] = useState<boolean>(false)
  const [requestPermissions, setRequestPermissions] = useState<boolean>(false)
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false)

  const onBarCodeRead = (scanResult: BarCodeReadEvent) => {
    setCode(scanResult.data)
    setVisible(false)
  }

  // Needed when navigating back from settings, when users selected "ask every time" as camera permission option
  useEffect(() => {
    if (requestPermissions) {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
        .then(() => setRequestPermissions(false))
        .catch(e => console.error(e))
    }
  }, [requestPermissions])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        setRequestPermissions(true)
      }
      appState.current = nextAppState
    })
    return () => {
      subscription.remove()
    }
  }, [])

  const openSettings = () => {
    Linking.openSettings().catch(() => console.error('Unable to open Settings'))
  }

  return (
    <Modal visible transparent animationType='fade' onRequestClose={() => setVisible(false)}>
      <Container>
        <Icon
          onPress={() => setVisible(false)}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          activeOpacity={1}>
          {isPressed ? (
            <CloseCircleIconBlue testID='close-circle-icon-blue' />
          ) : (
            <CloseCircleIconWhite testID='close-circle-icon-white' />
          )}
        </Icon>
        {permissionDenied && !requestPermissions ? (
          <NotAuthorisedView setVisible={setVisible} openSettings={openSettings} />
        ) : (
          <Camera
            captureAudio={false}
            onBarCodeRead={onBarCodeRead}
            testID='camera'
            onStatusChange={status => setPermissionDenied(status.cameraStatus === 'NOT_AUTHORIZED')}
            onCameraReady={() => setPermissionDenied(false)}
          />
        )}
      </Container>
    </Modal>
  )
}

export default AddCustomDisciplineScreen
