import React from 'react'
import styled from 'styled-components/native'

import { Document } from '../constants/endpoints'
import DocumentImageSection from './DocumentImageSection'
import WordItem from './WordItem'

const ItemContainer = styled.View`
  margin: ${props => props.theme.spacings.xl} 0;
  height: 10%;
  width: 85%;
  align-self: center;
`

interface Props {
  document: Document
}

const VocabularyDetailView = ({ document }: Props) => {
  return (
    <>
      <DocumentImageSection document={document} />
      <ItemContainer>
        <WordItem answer={{ word: document.word, article: document.article }} />
      </ItemContainer>
    </>
  )
}

export default VocabularyDetailView
