import React, { ReactElement, useRef } from 'react'
import { RNCamera } from 'react-native-camera'
import styled from 'styled-components/native'

import { CircleIconWhite, ImageIcon } from '../../../../assets/images'
import CameraOverlay from '../../../components/CameraOverlay'
import PressableOpacity from '../../../components/PressableOpacity'

const GALLERY_IMAGE_SIZE = 30
const TAKE_IMAGE_SIZE = 50

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
  margin-right: ${GALLERY_IMAGE_SIZE}px;
`

const Container = styled.View`
  flex-direction: row;
  justify-content: center;
`

interface Props {
  setVisible: (visible: boolean) => void
  numberOfImages: number
  pushImage: (imageUri: string) => void
}

// TODO
// adjust and test on ios
// write test

const ImageSelectionOverlay = ({ setVisible, pushImage, numberOfImages }: Props): ReactElement => {
  const camera = useRef<RNCamera>(null)

  const takePicture = async () => {
    if (camera.current) {
      const options = { quality: 0.5, base64: true }
      const data = await camera.current.takePictureAsync(options)
      if (numberOfImages < 3) {
        pushImage(data.uri)
      }
      if (numberOfImages >= 2) {
        setVisible(false)
      }
    }
  }

  return (
    <CameraOverlay setVisible={setVisible}>
      <Camera ref={camera} captureAudio={false} testID='camera'>
        <Container>
          <ActionBar>
            <PressableOpacity onPress={() => console.log('open gallery')}>
              {/* TODO LUN-440 implement gallery */}
              <ImageIcon width={GALLERY_IMAGE_SIZE} height={GALLERY_IMAGE_SIZE} testID='gallery-icon' />
            </PressableOpacity>
            <TakeImageButton onPress={takePicture}>
              <CircleIconWhite width={TAKE_IMAGE_SIZE} height={TAKE_IMAGE_SIZE} testID='shutter-button' />
            </TakeImageButton>
          </ActionBar>
        </Container>
      </Camera>
    </CameraOverlay>
  )
}

export default ImageSelectionOverlay
