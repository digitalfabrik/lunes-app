import React, { ReactElement } from 'react'
import { Image as RNImage } from 'react-native'

import styled from 'styled-components/native'

import { CloseCircleIconBlue } from '../../../../assets/images'
import PressableOpacity from '../../../components/PressableOpacity'

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

const Thumbnail = ({ image, deleteImage }: ThumbnailProps): ReactElement => (
  <Container>
    <Image source={{ uri: image }} />
    <CloseIcon onPress={deleteImage}>
      <CloseCircleIconBlue testID='delete-on-thumbnail' width={32} height={32} />
    </CloseIcon>
  </Container>
)

export default Thumbnail
