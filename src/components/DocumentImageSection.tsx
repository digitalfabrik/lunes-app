import React, { ReactElement } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { Document } from '../constants/endpoints'
import AudioPlayer from './AudioPlayer'
import FavoriteButton from './FavoriteButton'
import ImageCarousel from './ImageCarousel'

const AudioContainer = styled.View`
  position: absolute;
  bottom: ${wp('-4.5%')}px;
  align-self: center;
`
const FavoriteContainer = styled.View`
  position: absolute;
  top: ${props => props.theme.spacings.md};
  right: ${props => props.theme.spacings.sm};
`

const Container = styled.View`
  margin-bottom: ${props => props.theme.spacings.md};
`

interface Props {
  document: Document
  audioDisabled?: boolean
  minimized?: boolean
  submittedAlternative?: string | null
}

const DocumentImageSection = ({
  document,
  audioDisabled = false,
  minimized = false,
  submittedAlternative,
}: Props): ReactElement => (
  <Container>
    <ImageCarousel images={document.document_image} minimized={minimized} />
    <AudioContainer>
      <AudioPlayer document={document} disabled={audioDisabled} submittedAlternative={submittedAlternative} />
    </AudioContainer>
    <FavoriteContainer>
      <FavoriteButton document={document} />
    </FavoriteContainer>
  </Container>
)

export default DocumentImageSection
