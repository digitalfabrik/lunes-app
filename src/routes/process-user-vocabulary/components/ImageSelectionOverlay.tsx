import React, { ReactElement, useRef } from 'react'
import { RNCamera } from 'react-native-camera'
import styled from 'styled-components/native'

import { CircleIconWhite, ImageIcon } from '../../../../assets/images'
import CameraOverlay from '../../../components/CameraOverlay'
import PressableOpacity from '../../../components/PressableOpacity'

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

  const takeImage = async () => {
    if (camera.current) {
      const options = { quality: 0.5, base64: true }
      const data = await camera.current.takePictureAsync(options)
      setVisible(false)
      pushImage(data.uri)
    }
  }

  return (
    <CameraOverlay setVisible={setVisible}>
      <Camera ref={camera} captureAudio={false} testID='camera'>
        <Container>
          <ActionBar>
            {/* TODO LUN-440 implement gallery */}
            {/* eslint-disable-next-line no-console */}
            <PressableOpacity onPress={() => console.log('open gallery')}>
              <ImageIcon width={GALLERY_ICON_SIZE} height={GALLERY_ICON_SIZE} testID='gallery-icon' />
            </PressableOpacity>
            <TakeImageButton onPress={takeImage}>
              <CircleIconWhite width={TAKE_IMAGE_ICON_SIZE} height={TAKE_IMAGE_ICON_SIZE} testID='take-image-icon' />
            </TakeImageButton>
          </ActionBar>
        </Container>
      </Camera>
    </CameraOverlay>
  )
}

export default ImageSelectionOverlay
