import React, { PureComponent, ReactElement } from 'react'
import styled from 'styled-components/native'

import VocabularyListItem from '../../../components/VocabularyListItem'
import { ContentSecondary } from '../../../components/text/Content'
import { Document } from '../../../constants/endpoints'
import { getLabels } from '../../../services/helpers'

const AlternativesContainer = styled.View`
  padding-top: ${props => props.theme.spacings.xs};
`

const AlternativeWords = styled(ContentSecondary)`
  font-style: italic;
`

interface Props {
  document: Document
  showAlternatives: boolean
  navigateToDetail: (document: Document) => void
}

class DictionaryItem extends PureComponent<Props> {
  render(): ReactElement {
    const { document, navigateToDetail, showAlternatives } = this.props

    return (
      <VocabularyListItem key={document.id} document={document} onPress={() => navigateToDetail(document)}>
        <>
          {showAlternatives && (
            <AlternativesContainer>
              <AlternativeWords>
                {`${getLabels().exercises.vocabularyList.alternativeWords}: ${document.alternatives
                  .map(item => `${item.article.value} ${item.word}`)
                  .join(', ')}`}
              </AlternativeWords>
            </AlternativesContainer>
          )}
        </>
      </VocabularyListItem>
    )
  }
}

export default DictionaryItem
