import React, { ReactElement, ReactNode, useState } from 'react'
import { Modal as RNModal, Platform, Pressable } from 'react-native'
import { PERMISSIONS } from 'react-native-permissions'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { CloseCircleIconBlue, CloseCircleIconWhite } from '../../assets/images'
import useGrantPermissions from '../hooks/useGrantPermissions'
import { getLabels } from '../services/helpers'
import NotAuthorisedView from './NotAuthorisedView'

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`

const Header = styled.View`
  justify-content: center;
  align-items: flex-end;
  height: ${props => props.theme.spacings.xl};
  padding-right: ${props => props.theme.spacings.xs};
`

const CAMERA_PERMISSION = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA

type Props = {
  setVisible: (visible: boolean) => void
  children: ReactNode | ReactNode[]
}

const CameraOverlay = ({ setVisible, children }: Props): ReactElement => {
  const [isPressed, setIsPressed] = useState<boolean>(false)
  const { permissionRequested, permissionGranted } = useGrantPermissions(CAMERA_PERMISSION)

  return (
    <RNModal visible transparent animationType='fade' onRequestClose={() => setVisible(false)}>
      <Container>
        <Header>
          <Pressable
            onPress={() => setVisible(false)}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
          >
            {isPressed ? (
              <CloseCircleIconBlue testID='close-circle-icon-blue' width={hp('3.5%')} height={hp('3.5%')} />
            ) : (
              <CloseCircleIconWhite testID='close-circle-icon-white' width={hp('3.5%')} height={hp('3.5%')} />
            )}
          </Pressable>
        </Header>
        {permissionGranted && children}
        {permissionRequested && !permissionGranted && (
          <NotAuthorisedView
            description={getLabels().general.camera.noAuthorization.description}
            setVisible={setVisible}
          />
        )}
      </Container>
    </RNModal>
  )
}

export default CameraOverlay
