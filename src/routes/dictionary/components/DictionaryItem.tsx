import React, { PureComponent, ReactElement } from 'react'
import styled from 'styled-components/native'

import VocabularyListItem from '../../../components/VocabularyListItem'
import { ContentSecondary } from '../../../components/text/Content'
import { VocabularyItem } from '../../../constants/endpoints'
import { getLabels } from '../../../services/helpers'

const AlternativesContainer = styled.View`
  padding-top: ${props => props.theme.spacings.xs};
`

const AlternativeWords = styled(ContentSecondary)`
  font-style: italic;
`

interface DictionaryItemProps {
  vocabularyItem: VocabularyItem
  showAlternatives: boolean
  navigateToDetail: (vocabularyItem: VocabularyItem) => void
}

class DictionaryItem extends PureComponent<DictionaryItemProps> {
  render(): ReactElement {
    const { vocabularyItem, navigateToDetail, showAlternatives } = this.props

    return (
      <VocabularyListItem
        key={vocabularyItem.id}
        vocabularyItem={vocabularyItem}
        onPress={() => navigateToDetail(vocabularyItem)}>
        <>
          {showAlternatives && (
            <AlternativesContainer>
              <AlternativeWords>
                {`${getLabels().exercises.vocabularyList.alternativeWords}: ${vocabularyItem.alternatives
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
