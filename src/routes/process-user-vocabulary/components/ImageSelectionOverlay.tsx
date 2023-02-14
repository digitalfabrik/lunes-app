import { CameraRoll, PhotoIdentifier } from '@react-native-camera-roll/camera-roll'
import React, { ReactElement, useRef, useState } from 'react'
import { Platform, Pressable, ScrollView } from 'react-native'
import { RNCamera } from 'react-native-camera'
import { PERMISSIONS } from 'react-native-permissions'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { CircleIconWhite, ImageIcon } from '../../../../assets/images'
import CameraOverlay from '../../../components/CameraOverlay'
import NotAuthorisedView from '../../../components/NotAuthorisedView'
import PressableOpacity from '../../../components/PressableOpacity'
import useGrantPermissions from '../../../hooks/useGrantPermissions'
import { getLabels } from '../../../services/helpers'
import { reportError } from '../../../services/sentry'
import { UserVocabularyImage } from '../UserVocabularyProcessScreen'

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

const Photo = styled.Image`
  width: ${wp('32%')}px;
  height: ${wp('32%')}px;
  margin: ${wp('0.6%')}px;
`

type ImageSelectionOverlayProps = {
  setVisible: (visible: boolean) => void
  pushImage: (image: UserVocabularyImage) => void
}

const ImageSelectionOverlay = ({ setVisible, pushImage }: ImageSelectionOverlayProps): ReactElement => {
  const camera = useRef<RNCamera>(null)
  const [showGallery, setShowGallery] = useState<boolean>(false)
  const [photos, setPhotos] = useState<PhotoIdentifier[]>([])
  const { permissionRequested, permissionGranted } = useGrantPermissions(
    Platform.OS === 'ios' ? PERMISSIONS.IOS.MEDIA_LIBRARY : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
  )

  const getGalleryPictures = () => {
    CameraRoll.getPhotos({ first: 30, assetType: 'Photos' })
      .then(res => {
        setPhotos(res.edges)
        setShowGallery(true)
      })
      .catch(reportError)
  }

  const selectImage = async (imageUri: string) => {
    // iOS saves images with an internal uri, react-native-fs has problems with uploading those files
    if (imageUri.startsWith('ph://')) {
      const compatibleUri = await CameraRoll.iosGetImageDataById(imageUri)
      if (!compatibleUri.node.image.filepath) {
        reportError('No filepath received from CameraRoll.iosGetImageDataById')
        return
      }
      pushImage({ uri: compatibleUri.node.image.filepath, shouldBeCopied: true })
    } else {
      pushImage({ uri: imageUri, shouldBeCopied: true })
    }
    setVisible(false)
  }

  const takePhoto = async () => {
    if (camera.current) {
      const options = { quality: 0.5, base64: true }
      const data = await camera.current.takePictureAsync(options)
      setVisible(false)
      pushImage({ uri: data.uri, shouldBeCopied: false })
    }
  }

  return (
    <CameraOverlay setVisible={setVisible}>
      {showGallery ? (
        <>
          {permissionRequested && !permissionGranted && (
            <NotAuthorisedView
              description={getLabels().general.library.noAuthorization.description}
              setVisible={setVisible}
            />
          )}
          {permissionGranted && (
            <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {photos.map(photo => (
                <Pressable key={photo.node.timestamp} onPress={() => selectImage(photo.node.image.uri)}>
                  <Photo source={{ uri: photo.node.image.uri }} />
                </Pressable>
              ))}
            </ScrollView>
          )}
        </>
      ) : (
        <Camera ref={camera} captureAudio={false} testID='camera'>
          <Container>
            <ActionBar>
              <PressableOpacity onPress={getGalleryPictures}>
                <ImageIcon width={GALLERY_ICON_SIZE} height={GALLERY_ICON_SIZE} testID='gallery-icon' />
              </PressableOpacity>
              <TakeImageButton onPress={takePhoto}>
                <CircleIconWhite width={TAKE_IMAGE_ICON_SIZE} height={TAKE_IMAGE_ICON_SIZE} testID='take-image-icon' />
              </TakeImageButton>
            </ActionBar>
          </Container>
        </Camera>
      )}
    </CameraOverlay>
  )
}

export default ImageSelectionOverlay
