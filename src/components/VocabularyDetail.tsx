import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { Document } from '../constants/endpoints'
import DocumentImageSection from './DocumentImageSection'
import WordItem from './WordItem'

const ItemContainer = styled.View`
  margin-top: ${props => props.theme.spacings.xl};
  height: 10%;
  width: 85%;
  align-self: center;
`

interface VocabularyDetailProps {
  document: Document
}

const VocabularyDetail = ({ document }: VocabularyDetailProps): ReactElement => (
  <>
    <DocumentImageSection document={document} />
    <ItemContainer>
      <WordItem answer={{ word: document.word, article: document.article }} />
    </ItemContainer>
  </>
)

export default VocabularyDetail
