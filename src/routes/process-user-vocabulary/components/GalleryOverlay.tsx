// DONE: move gallery to here
// DONE: set control of whether to show gallery in UserVocabularyProcessScreen
// DONE: opens twice on sim iOS every second time
// DONE: in sim Android, closing means you have to close three times (also on first opening)
// DONE: fix permissions for Android
// gallery permission is not requested on first visit in Android (on Pixel 6, Android 33)
// PHOTO_LIBRARY works on my iPhone, and on sim iOS, after deleting derived Xcode data
// tried: putting gallery into separate component with own permissions call
// tried: only call hook if the gallery is open, poor choice
// latest idea: also replace for camera, maybe the permissions aus einem Guss?
// DONE: switch package to react-native-image-picker
// DONE: first pic (which is HDR) doesn't work on sim iOS, does on real iOS
// https://developer.apple.com/forums/thread/653993 Image is corrupted
// DONE: empty camera screen shown after choosing image
// DONE: style error message
// DONE: when closing the gallery without choosing a picture, the camera also closes
// TODO: sim ios: only selected pics are allowed (limited)
// switch to https://github.com/ivpusic/react-native-image-crop-picker
// TODO: when closing the error message, should be sent to ImageSelectionOverlay
// DONE: choose permission in Podfile
import React, { ReactElement, useCallback, useEffect } from 'react'
import { Platform } from 'react-native'
import { openPicker } from 'react-native-image-crop-picker'
import { Asset, launchImageLibrary } from 'react-native-image-picker'
import { PERMISSIONS } from 'react-native-permissions'

import NotAuthorisedView from '../../../components/NotAuthorisedView'
import useGrantPermissions from '../../../hooks/useGrantPermissions'
import { getLabels } from '../../../services/helpers'
import { reportError } from '../../../services/sentry'
import { UserVocabularyImage } from '../UserVocabularyProcessScreen'

type GalleryOverlayProps = {
  setVisible: (visible: boolean) => void
  pushImage: (image: UserVocabularyImage) => void
}

// eslint-disable-next-line consistent-return
const GalleryOverlay = ({ setVisible, pushImage }: GalleryOverlayProps): ReactElement | undefined => {
  const androidMediaPermission =
    // eslint-disable-next-line no-magic-numbers
    Platform.Version >= 33 ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
  const { permissionRequested, permissionGranted } = useGrantPermissions(
    Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : androidMediaPermission
  )

  // const openGallery = //useCallback(
  //   () =>
  //     openPicker({
  //       smartAlbums: ['UserLibrary'],
  //       mediaType: 'photo',
  //     }).then(image => {
  //       setVisible(false)
  //       pushImage({ uri: image.path, shouldBeCopied: true })
  //       console.log(image)
  //     }) //,
  // launchImageLibrary(
  //   {
  //     mediaType: 'photo',
  //     includeBase64: true,
  //   },
  //   res => {
  //     setVisible(false)
  //     res.assets?.map((asset: Asset) => asset.uri && pushImage({ uri: asset.uri, shouldBeCopied: true }))
  //   }
  // ),
  // (pushImage, setVisible)
  // ]
  // )

  useEffect(() => {
    // TODO: useCallback
    const openGallery = () =>
      openPicker({
        smartAlbums: ['UserLibrary'],
        mediaType: 'photo',
      }).then(image => {
        setVisible(false)
        pushImage({ uri: image.path, shouldBeCopied: true })
        console.log(image)
      })
    if (permissionGranted) {
      console.log('opening')
      openGallery().catch(e => console.log('error', e))
    }
  }, [permissionGranted, pushImage, setVisible])

  if (permissionRequested && !permissionGranted) {
    return (
      <NotAuthorisedView
        description={getLabels().general.library.noAuthorization.description} // TODO: Why?
        setVisible={setVisible}
      />
    )
  }
  // return <Modal></Modal>
}

export default GalleryOverlay
