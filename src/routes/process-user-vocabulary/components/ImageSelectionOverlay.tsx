import React, { ReactElement, useRef, useState } from 'react'
import { Platform } from 'react-native'
import { RNCamera } from 'react-native-camera'
import { openPicker } from 'react-native-image-crop-picker'
import { PERMISSIONS } from 'react-native-permissions'
import styled from 'styled-components/native'

import { CircleIconWhite, ImageIcon } from '../../../../assets/images'
import CameraOverlay from '../../../components/CameraOverlay'
import NotAuthorisedView from '../../../components/NotAuthorisedView'
import PressableOpacity from '../../../components/PressableOpacity'
import { getLabels } from '../../../services/helpers'
import { reportError } from '../../../services/sentry'

const GALLERY_ICON_SIZE = 30
const TAKE_IMAGE_ICON_SIZE = 50

const Camera = styled(RNCamera)`
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

type ImageSelectionOverlayProps = {
  setVisible: (visible: boolean) => void
  pushImage: (imageUri: string) => void
}

const ImageSelectionOverlay = ({ setVisible, pushImage }: ImageSelectionOverlayProps): ReactElement => {
  const camera = useRef<RNCamera>(null)
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false)
  const [showNotAuthorised, setShowNotAuthorised] = useState<boolean>(false)

  const takePhoto = async () => {
    if (camera.current) {
      const options = { quality: 0.5, base64: true }
      const data = await camera.current.takePictureAsync(options)
      setVisible(false)
      pushImage(data.uri)
    }
  }

  const openGallery = () => {
    setIsGalleryOpen(true)
    openPicker({
      mediaType: 'photo',
    })
      .then(image => {
        setVisible(false)
        pushImage(image.path)
      })
      .catch((e: Error) => {
        if (e.message.includes('permission')) {
          setShowNotAuthorised(true)
        } else if (!e.message.includes('cancelled')) {
          reportError(e)
        }
      })
      .finally(() => {
        setIsGalleryOpen(false)
      })
  }

  const firstAndroidVersionWithSplitPermissions = 33
  const androidMediaPermission =
    Platform.Version >= firstAndroidVersionWithSplitPermissions
      ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
      : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE

  let permission
  if (isGalleryOpen) {
    permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : androidMediaPermission
  }

  if (showNotAuthorised) {
    return (
      <NotAuthorisedView
        description={getLabels().general.library.noAuthorization.description}
        setVisible={setShowNotAuthorised}
      />
    )
  }

  return (
    <CameraOverlay setVisible={setVisible} permission={permission}>
      <Camera ref={camera} captureAudio={false} testID='camera'>
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
      </Camera>
    </CameraOverlay>
  )
}

export default ImageSelectionOverlay
