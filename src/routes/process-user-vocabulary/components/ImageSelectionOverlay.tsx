import React, { ReactElement, useRef, useState } from 'react'
import { Pressable } from 'react-native'
import { openPicker } from 'react-native-image-crop-picker'
import { Camera, useCameraDevice } from 'react-native-vision-camera'
import styled from 'styled-components/native'

import { CircleIconWhite, ImageIcon } from '../../../../assets/images'
import CameraOverlay from '../../../components/CameraOverlay'
import PressableOpacity from '../../../components/PressableOpacity'
import useAppState from '../../../hooks/useAppState'
import getGalleryPermission from '../../../services/getGalleryPermission'
import { reportError } from '../../../services/sentry'

const GALLERY_ICON_SIZE = 30
const TAKE_IMAGE_ICON_SIZE = 70

const StyledCamera = styled(Camera)`
  flex: 1;
  justify-content: flex-end;
  position: relative;
  padding: ${props => props.theme.spacings.sm};
`

const TakeImageButtonContainer = styled.View`
  flex: 2;
  align-items: center;
  margin-right: ${GALLERY_ICON_SIZE}px;
`

const Container = styled.View`
  flex-direction: row;
  opacity: 0.5;
  position: absolute;
  justify-content: center;
  align-items: center;
  width: 100%;
  bottom: 0;
  padding: ${props => props.theme.spacings.lg};
  background-color: ${props => props.theme.colors.black};
`

type ImageSelectionOverlayProps = {
  setVisible: (visible: boolean) => void
  pushImage: (imageUri: string) => void
}

const ImageSelectionOverlay = ({ setVisible, pushImage }: ImageSelectionOverlayProps): ReactElement | null => {
  const device = useCameraDevice('back')
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(true)
  const camera = useRef<Camera>(null)
  const { inForeground } = useAppState()

  const takePhoto = async () => {
    try {
      if (camera.current) {
        const data = await camera.current.takePhoto()
        setVisible(false)
        pushImage(`file://${data.path}`)
      }
    } catch (error) {
      console.warn(error)
    }
  }

  const openGallery = async () => {
    setIsGalleryOpen(true)
    try {
      const image = await openPicker({ mediaType: 'photo' })
      console.log('asf')
      setVisible(false)
      pushImage(image.path)
    } catch (error: unknown) {
      const isCancel = error instanceof Error && error.message.includes('cancelled')
      if (!isCancel) {
        console.log(JSON.stringify(error))
        reportError(error)
      }
    }
    setIsGalleryOpen(false)
  }

  if (!device) {
    return null
  }

  return (
    <CameraOverlay setVisible={setVisible} permission={isGalleryOpen ? getGalleryPermission() : undefined}>
      <StyledCamera
        ref={camera}
        device={device}
        photo
        photoQualityBalance='speed'
        isActive={inForeground}
        testID='camera'
      />
      <Container>
        <PressableOpacity onPress={openGallery}>
          <ImageIcon width={GALLERY_ICON_SIZE} height={GALLERY_ICON_SIZE} testID='gallery-icon' />
        </PressableOpacity>
        <TakeImageButtonContainer>
          <Pressable onPress={takePhoto}>
            <CircleIconWhite width={TAKE_IMAGE_ICON_SIZE} height={TAKE_IMAGE_ICON_SIZE} testID='take-image-icon' />
          </Pressable>
        </TakeImageButtonContainer>
      </Container>
    </CameraOverlay>
  )
}

export default ImageSelectionOverlay
