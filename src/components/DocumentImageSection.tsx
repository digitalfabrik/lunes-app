import React, { ReactElement } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { Document } from '../constants/endpoints'
import AudioPlayer from './AudioPlayer'
import FavoriteButton from './FavoriteButton'
import ImageCarousel from './ImageCarousel'

const StyledFavoriteButton = styled(FavoriteButton)`
  position: absolute;
  top: ${wp('9%')}px;
  right: ${wp('9%')}px;
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
  submittedAlternative
}: Props): ReactElement => (
  <>
    <ImageCarousel images={document.document_image} minimized={minimized} />
    <AudioPlayer document={document} disabled={audioDisabled} submittedAlternative={submittedAlternative} />
    <StyledFavoriteButton document={document} />
  </>
)

export default DocumentImageSection
