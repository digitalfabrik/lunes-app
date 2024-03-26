import { Platform } from 'react-native'
import { Permission, PERMISSIONS } from 'react-native-permissions'

const getGalleryPermission = (): Permission => {
  if (Platform.OS === 'ios') {
    return PERMISSIONS.IOS.PHOTO_LIBRARY
  }

  if (typeof Platform.Version !== 'number') {
    throw new Error('version type is incompatible')
  }

  const firstAndroidVersionWithSplitPermissions = 33
  return Platform.Version >= firstAndroidVersionWithSplitPermissions
    ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
    : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
}

export default getGalleryPermission
