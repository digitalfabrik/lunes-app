import React, { ReactElement, useCallback, useState } from 'react'
import { Image, ImageProps, ImageStyle, StyleProp } from 'react-native'
import { SvgCssUri } from 'react-native-svg/css'

const isSvgUrl = (url: string): boolean => /\.svg([?#]|$)/i.test(url)

type RemoteLogoProps = {
  uri: string
  width: number
  height: number
  fallback?: ReactElement
  style?: StyleProp<ImageStyle>
} & Pick<ImageProps, 'testID' | 'accessible' | 'accessibilityRole' | 'accessibilityLabel'>

const RemoteLogo = ({ uri, width, height, fallback, style, ...props }: RemoteLogoProps): ReactElement | null => {
  const [failedUri, setFailedUri] = useState<string | null>(null)
  // SvgCssUri downloads the logo again whenever onError changes
  const handleError = useCallback(() => setFailedUri(uri), [uri])

  if (failedUri === uri) {
    return fallback ?? null
  }
  return isSvgUrl(uri) ? (
    <SvgCssUri uri={uri} width={width} height={height} style={style} onError={handleError} {...props} />
  ) : (
    <Image source={{ uri }} style={[{ width, height }, style]} resizeMode='contain' onError={handleError} {...props} />
  )
}

export default RemoteLogo
