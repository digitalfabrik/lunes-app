import React, { ReactElement, useRef } from 'react'
import { Pressable } from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker'
import { Camera, useCameraDevice } from 'react-native-vision-camera'
import styled from 'styled-components/native'

import { CircleIconWhite, ImageIcon } from '../../../../assets/images'
import CameraOverlay from '../../../components/CameraOverlay'
import PressableOpacity from '../../../components/PressableOpacity'
import useAppState from '../../../hooks/useAppState'
import { reportError } from '../../../services/sentry'

const GALLERY_ICON_SIZE = 30
const TAKE_IMAGE_ICON_SIZE = 70

const StyledCamera = styled(Camera)`
  flex: 1;
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
      reportError(error)
    }
  }

  const openGallery = async () => {
    try {
      const { assets } = await launchImageLibrary({ mediaType: 'photo' })
      const imageUri = assets?.[0]?.uri
      if (imageUri) {
        pushImage(imageUri)
        setVisible(false)
      }
    } catch (error) {
      reportError(error)
    }
  }

  return (
    <CameraOverlay setVisible={setVisible}>
      {device && (
        <StyledCamera
          ref={camera}
          device={device}
          photo
          photoQualityBalance='speed'
          isActive={inForeground}
          testID='camera'
        />
      )}
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
