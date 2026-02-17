import React, { memo, ReactElement } from 'react'
import styled from 'styled-components/native'

import VocabularyListItem from '../../../components/VocabularyListItem'
import { ContentSecondary } from '../../../components/text/Content'
import VocabularyItem from '../../../models/VocabularyItem'
import { getLabels } from '../../../services/helpers'

const AlternativesContainer = styled.View`
  padding-top: ${props => props.theme.spacings.xs};
`

const AlternativeWords = styled(ContentSecondary)`
  font-style: italic;
`

type DictionaryItemProps = {
  vocabularyItem: VocabularyItem
  showAlternatives: boolean
  navigateToDetail: (vocabularyItem: VocabularyItem) => void
}

const DictionaryItem = ({ vocabularyItem, navigateToDetail, showAlternatives }: DictionaryItemProps): ReactElement => (
  <VocabularyListItem
    key={JSON.stringify(vocabularyItem.id)}
    vocabularyItem={vocabularyItem}
    onPress={() => navigateToDetail(vocabularyItem)}
  >
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

export default memo(DictionaryItem)
