import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { AppState, Modal as RNModal, Platform } from 'react-native'
import { BarCodeReadEvent, RNCamera } from 'react-native-camera'
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { CloseCircleIconBlue, CloseCircleIconWhite } from '../../../../assets/images'
import { reportError } from '../../../services/sentry'
import NotAuthorisedView from './NotAuthorisedView'

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`

const Icon = styled.Pressable`
  align-self: flex-end;
  margin: ${props => `${props.theme.spacings.xs} ${props.theme.spacings.sm}`};
  width: ${wp('7%')}px;
  height: ${wp('7%')}px;
`

const Camera = styled(RNCamera)`
  flex: 1;
  position: relative;
`

interface AddCustomDisciplineScreenProps {
  setVisible: (visible: boolean) => void
  setCode: (code: string) => void
}

const AddCustomDisciplineScreen = ({ setVisible, setCode }: AddCustomDisciplineScreenProps): ReactElement => {
  const appState = useRef(AppState.currentState)

  const [isPressed, setIsPressed] = useState<boolean>(false)
  const [permissionRequested, setPermissionRequested] = useState<boolean>(false)
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false)

  const onBarCodeRead = (scanResult: BarCodeReadEvent) => {
    setCode(scanResult.data)
    setVisible(false)
  }

  // Needed when navigating back from settings, when users selected "ask every time" as camera permission option
  useEffect(() => {
    if (!permissionRequested) {
      request(Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA)
        .then(result => setPermissionGranted(result === RESULTS.GRANTED))
        .catch(reportError)
        .finally(() => setPermissionRequested(true))
    }
  }, [permissionRequested])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if ((appState.current === 'inactive' || appState.current === 'background') && nextAppState === 'active') {
        setPermissionRequested(false)
      }
      appState.current = nextAppState
    })
    return subscription.remove
  }, [])

  return (
    <RNModal visible transparent animationType='fade' onRequestClose={() => setVisible(false)}>
      <Container>
        <Icon
          onPress={() => setVisible(false)}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}>
          {isPressed ? (
            <CloseCircleIconBlue testID='close-circle-icon-blue' width={wp('7%')} height={wp('7%')} />
          ) : (
            <CloseCircleIconWhite testID='close-circle-icon-white' width={wp('7%')} height={wp('7%')} />
          )}
        </Icon>
        {permissionGranted && <Camera captureAudio={false} onBarCodeRead={onBarCodeRead} testID='camera' />}
        {permissionRequested && !permissionGranted && <NotAuthorisedView setVisible={setVisible} />}
      </Container>
    </RNModal>
  )
}

export default AddCustomDisciplineScreen
