import { useIsFocused } from '@react-navigation/native'
import React, { ReactElement, useRef, useState } from 'react'
import { Platform } from 'react-native'
import { openPicker } from 'react-native-image-crop-picker'
import { PERMISSIONS } from 'react-native-permissions'
import { Camera, useCameraDevice } from 'react-native-vision-camera'
import styled from 'styled-components/native'

import { CircleIconWhite, ImageIcon } from '../../../../assets/images'
import CameraOverlay from '../../../components/CameraOverlay'
import NotAuthorisedView from '../../../components/NotAuthorisedView'
import PressableOpacity from '../../../components/PressableOpacity'
import useGrantPermissions from '../../../hooks/useGrantPermissions'
import getGalleryPermission from '../../../services/getGalleryPermission'
import { getLabels } from '../../../services/helpers'
import { reportError } from '../../../services/sentry'

const GALLERY_ICON_SIZE = 30
const TAKE_IMAGE_ICON_SIZE = 50

const StyledCamera = styled(Camera)`
  flex: 1;
  justify-content: flex-end;
  position: relative;
  padding: ${props => props.theme.spacings.sm};
`

const ActionBar = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
`

const TakeImageButton = styled.Pressable`
  flex: 2;
  align-items: center;
  margin-right: ${GALLERY_ICON_SIZE}px;
`

const Container = styled.View`
  flex-direction: row;
  justify-content: center;
`

const CameraPermission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA
const GalleryPermission = getGalleryPermission()

type ImageSelectionOverlayProps = {
  setVisible: (visible: boolean) => void
  pushImage: (imageUri: string) => void
}

const ImageSelectionOverlay = ({ setVisible, pushImage }: ImageSelectionOverlayProps): ReactElement | null => {
  const device = useCameraDevice('back')
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(!!device)
  const { permissionRequested, permissionGranted } = useGrantPermissions(
    isGalleryOpen ? GalleryPermission : CameraPermission,
  )
  const camera = useRef<Camera>(null)
  const isFocused = useIsFocused()
  const permissionDenied = permissionRequested && !permissionGranted

  const takePhoto = async () => {
    if (camera.current) {
      const data = await camera.current.takePhoto()
      setVisible(false)
      pushImage(data.path)
    }
  }

  const openGallery = async () => {
    setIsGalleryOpen(true)
    try {
      const image = await openPicker({ mediaType: 'photo' })
      setVisible(false)
      pushImage(image.path)
    } catch (error: unknown) {
      const isCancel = error instanceof Error && error.message.includes('cancelled')
      if (!isCancel) {
        reportError(error)
      }
    }
    setIsGalleryOpen(false)
  }

  if (!device) {
    return null
  }

  return (
    <CameraOverlay setVisible={setVisible}>
      {permissionDenied && (
        <NotAuthorisedView
          description={getLabels().general.library.noAuthorization.description}
          setVisible={setVisible}
        />
      )}
      {permissionGranted && (
        <StyledCamera
          ref={camera}
          device={device}
          photo
          photoQualityBalance='speed'
          isActive={isFocused}
          preview={false}
          testID='camera'>
          <Container>
            <ActionBar>
              <PressableOpacity onPress={openGallery}>
                <ImageIcon width={GALLERY_ICON_SIZE} height={GALLERY_ICON_SIZE} testID='gallery-icon' />
              </PressableOpacity>
              <TakeImageButton onPress={takePhoto}>
                <CircleIconWhite width={TAKE_IMAGE_ICON_SIZE} height={TAKE_IMAGE_ICON_SIZE} testID='take-image-icon' />
              </TakeImageButton>
            </ActionBar>
          </Container>
        </StyledCamera>
      )}
    </CameraOverlay>
  )
}

export default ImageSelectionOverlay
