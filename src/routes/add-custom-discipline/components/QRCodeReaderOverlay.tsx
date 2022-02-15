import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { AppState, Linking, Modal, PermissionsAndroid } from 'react-native'
import { BarCodeReadEvent, RNCamera } from 'react-native-camera'
import styled from 'styled-components/native'

import { CloseCircleIconBlue, CloseCircleIconWhite } from '../../../../assets/images'
import Button from '../../../components/Button'
import { BUTTONS_THEME } from '../../../constants/data'
import labels from '../../../constants/labels.json'

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

const NotAuthorisedView = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: ${props => props.theme.colors.lunesWhite};
`

const NoAuthDescription = styled.Text`
  font-family: ${props => props.theme.fonts.contentFontRegular};
  font-size: ${props => props.theme.fonts.defaultFontSize};
  color: ${props => props.theme.colors.lunesGreyMedium};
  padding-bottom: 20px;
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

  const refresh = () => {
    Linking.openSettings().catch(() => console.error('Unable to open Settings'))
  }

  return (
    <Modal visible transparent animationType='fade'>
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
        <Camera
          captureAudio={false}
          onBarCodeRead={onBarCodeRead}
          testID='camera'
          onStatusChange={status => setPermissionDenied(status.cameraStatus === 'NOT_AUTHORIZED')}
          onCameraReady={() => setPermissionDenied(false)}>
          {() =>
            permissionDenied && !requestPermissions ? (
              <NotAuthorisedView>
                <NoAuthDescription>
                  {labels.addCustomDiscipline.qrCodeScanner.noAuthorization.description}
                </NoAuthDescription>
                <Button
                  onPress={() => setVisible(false)}
                  label={labels.addCustomDiscipline.qrCodeScanner.noAuthorization.back}
                  buttonTheme={BUTTONS_THEME.outlined}
                />
                <Button
                  onPress={() => refresh()}
                  label={labels.addCustomDiscipline.qrCodeScanner.noAuthorization.grant}
                  buttonTheme={BUTTONS_THEME.contained}
                />
              </NotAuthorisedView>
            ) : (
              <></>
            )
          }
        </Camera>
      </Container>
    </Modal>
  )
}

export default AddCustomDisciplineScreen
