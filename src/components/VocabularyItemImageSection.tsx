import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import VocabularyItem from '../models/VocabularyItem'
import { stringifyVocabularyItem } from '../services/helpers'
import AudioPlayer from './AudioPlayer'
import FavoriteButton from './FavoriteButton'
import ImageCarousel from './ImageCarousel'

const AudioContainer = styled.View`
  position: absolute;
  bottom: -16px;
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

type VocabularyItemSectionProps = {
  vocabularyItem: VocabularyItem
  audioDisabled?: boolean
  showAudioPlayer?: boolean
  submittedAlternative?: string | null
}

const VocabularyItemImageSection = ({
  vocabularyItem,
  audioDisabled = false,
  showAudioPlayer = true,
  submittedAlternative,
}: VocabularyItemSectionProps): ReactElement => (
  <Container>
    <ImageCarousel images={vocabularyItem.images} />
    {showAudioPlayer && (
      <AudioContainer>
        <AudioPlayer
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- False positive, left hand side is possible null or undefined
          audio={submittedAlternative ?? vocabularyItem.audio ?? stringifyVocabularyItem(vocabularyItem)}
          isTtsText={!!submittedAlternative || !vocabularyItem.audio}
          disabled={audioDisabled}
        />
      </AudioContainer>
    )}
    <FavoriteContainer>
      <FavoriteButton vocabularyItem={vocabularyItem} />
    </FavoriteContainer>
  </Container>
)

export default VocabularyItemImageSection
