import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { VocabularyItem } from '../constants/endpoints'
import DocumentImageSection from './DocumentImageSection'
import WordItem from './WordItem'

const ItemContainer = styled.View`
  margin-top: ${props => props.theme.spacings.xl};
  height: 10%;
  width: 85%;
  align-self: center;
`

interface VocabularyDetailProps {
  vocabularyItem: VocabularyItem
}

const VocabularyDetail = ({ vocabularyItem }: VocabularyDetailProps): ReactElement => (
  <>
    <DocumentImageSection vocabularyItem={vocabularyItem} />
    <ItemContainer>
      <WordItem answer={{ word: vocabularyItem.word, article: vocabularyItem.article }} />
    </ItemContainer>
  </>
)

export default VocabularyDetail
