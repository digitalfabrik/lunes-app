import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { AppState, Modal as RNModal, Platform } from 'react-native'
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { CloseCircleIconBlue, CloseCircleIconWhite } from '../../assets/images'
import { reportError } from '../services/sentry'
import NotAuthorisedView from './NotAuthorisedView'

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`

const Icon = styled.Pressable`
  align-self: flex-end;
  margin: ${props => `${props.theme.spacings.xs} ${props.theme.spacings.sm}`};
  width: ${hp('3.5%')}px;
  height: ${hp('3.5%')}px;
`

interface Props {
  setVisible: (visible: boolean) => void
  children: ReactElement
}

const CameraOverlay = ({ setVisible, children }: Props): ReactElement => {
  const appState = useRef(AppState.currentState)

  const [isPressed, setIsPressed] = useState<boolean>(false)
  const [permissionRequested, setPermissionRequested] = useState<boolean>(false)
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false)

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
            <CloseCircleIconBlue testID='close-circle-icon-blue' width={hp('3.5%')} height={hp('3.5%')} />
          ) : (
            <CloseCircleIconWhite testID='close-circle-icon-white' width={hp('3.5%')} height={hp('3.5%')} />
          )}
        </Icon>
        {permissionGranted && children}
        {permissionRequested && !permissionGranted && <NotAuthorisedView setVisible={setVisible} />}
      </Container>
    </RNModal>
  )
}

export default CameraOverlay
