import React from 'react'
import { Image as RNImage } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { CloseCircleIconBlue } from '../../../../assets/images'
import PressableOpacity from '../../../components/PressableOpacity'

const Container = styled.View`
  margin: ${props => props.theme.spacings.xs};
`

const CloseIcon = styled(PressableOpacity)`
  position: absolute;
  right: 0px;
  padding: ${props => props.theme.spacings.xxs};
`

const Image = styled(RNImage)`
  width: ${hp('12%')}px;
  height: ${hp('12%')}px;
`

interface ThumbnailProps {
  image: string
  deleteImage: () => void
}

const Thumbnail = ({ image, deleteImage }: ThumbnailProps): JSX.Element => (
  <Container>
    <Image source={{ uri: image }} />
    <CloseIcon onPress={deleteImage}>
      <CloseCircleIconBlue testID='delete-on-thumbnail' width={hp('4%')} height={hp('4%')} />
    </CloseIcon>
  </Container>
)

export default Thumbnail
