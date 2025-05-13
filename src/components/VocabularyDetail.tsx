import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { VocabularyItem } from '../constants/endpoints'
import VocabularyItemImageSection from './VocabularyItemImageSection'
import WordItem from './WordItem'

const ItemContainer = styled.View`
  margin-top: ${props => props.theme.spacings.xl};
  width: 85%;
  align-self: center;
`

type VocabularyDetailProps = {
  vocabularyItem: VocabularyItem
}

const VocabularyDetail = ({ vocabularyItem }: VocabularyDetailProps): ReactElement => (
  <>
    <VocabularyItemImageSection vocabularyItem={vocabularyItem} />
    <ItemContainer>
      <WordItem answer={{ word: vocabularyItem.word, article: vocabularyItem.article }} />
    </ItemContainer>
  </>
)

export default VocabularyDetail
