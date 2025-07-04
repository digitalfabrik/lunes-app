import React, { ReactElement } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { VocabularyItem } from '../constants/endpoints'
import { useIsSilent } from '../hooks/useVolumeState'
import { getLabels, stringifyVocabularyItem } from '../services/helpers'
import AudioPlayer from './AudioPlayer'
import FavoriteButton from './FavoriteButton'
import ImageCarousel from './ImageCarousel'
import { ContentError } from './text/Content'

const AudioContainer = styled.View`
  position: absolute;
  bottom: ${hp('-2.25%')}px;
  align-self: center;
  align-items: center;
`
const FavoriteContainer = styled.View`
  position: absolute;
  top: ${props => props.theme.spacings.md};
  right: ${props => props.theme.spacings.sm};
`

const Container = styled.View`
  margin-bottom: ${props => props.theme.spacings.md};
`

const ErrorContainer = styled.View`
  background-color: ${prop => prop.theme.colors.lightGreyBackground};
  margin-bottom: ${props => props.theme.spacings.xs};
  padding: ${props => props.theme.spacings.xs};
  align-items: center;
  border-radius: ${props => props.theme.spacings.xs};
`

type VocabularyItemSectionProps = {
  vocabularyItem: VocabularyItem
  audioDisabled?: boolean
  minimized?: boolean
  submittedAlternative?: string | null
}

const VocabularyItemImageSection = ({
  vocabularyItem,
  audioDisabled = false,
  minimized = false,
  submittedAlternative,
}: VocabularyItemSectionProps): ReactElement => {
  const isSilent = useIsSilent()

  return (
    <Container>
      <ImageCarousel images={vocabularyItem.images} minimized={minimized} />
      <AudioContainer>
        {!audioDisabled && isSilent && (
          <ErrorContainer>
            <ContentError>{getLabels().general.error.deviceIsMuted}</ContentError>
          </ErrorContainer>
        )}
        <AudioPlayer
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- False positive, left hand side is possible null or undefined
          audio={submittedAlternative ?? vocabularyItem.audio ?? stringifyVocabularyItem(vocabularyItem)}
          isTtsText={!!submittedAlternative || !vocabularyItem.audio}
          disabled={audioDisabled}
        />
      </AudioContainer>
      <FavoriteContainer>
        <FavoriteButton vocabularyItem={vocabularyItem} />
      </FavoriteContainer>
    </Container>
  )
}

export default VocabularyItemImageSection
