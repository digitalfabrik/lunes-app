import React, { ReactElement } from 'react'
import { Image as RNImage } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { CloseCircleFilledIcon } from '../../../../assets/images'
import PressableOpacity from '../../../components/PressableOpacity'
import { getLabels } from '../../../services/helpers'

const Container = styled.View`
  margin: ${props => props.theme.spacings.xs};
`

const CloseIcon = styled(PressableOpacity)`
  position: absolute;
  right: 0;
  padding: ${props => props.theme.spacings.xxs};
`

const Image = styled(RNImage)`
  width: 96px;
  height: 96px;
`

type ThumbnailProps = {
  image: string
  deleteImage: () => void
}

const Thumbnail = ({ image, deleteImage }: ThumbnailProps): ReactElement => {
  const theme = useTheme()
  return (
    <Container>
      <Image source={{ uri: image }} />
      <CloseIcon onPress={deleteImage} accessibilityLabel={getLabels().userVocabulary.creation.deleteImage}>
        <CloseCircleFilledIcon
          testID='delete-on-thumbnail'
          width={theme.sizes.defaultIcon}
          height={theme.sizes.defaultIcon}
        />
      </CloseIcon>
    </Container>
  )
}

export default Thumbnail
