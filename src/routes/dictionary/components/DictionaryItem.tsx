import React, { memo, ReactElement } from 'react'
import styled from 'styled-components/native'

import VocabularyListItem from '../../../components/VocabularyListItem'
import { ContentSecondary } from '../../../components/text/Content'
import VocabularyItem from '../../../models/VocabularyItem'
import { getLabels, stringifyVocabularyItem } from '../../../services/helpers'
import { hyphenated } from '../../../services/hyphenation'

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

const DictionaryItem = ({ vocabularyItem, navigateToDetail, showAlternatives }: DictionaryItemProps): ReactElement => {
  const alternatives = `${getLabels().exercises.vocabularyList.alternativeWords}: ${vocabularyItem.alternatives
    .map(stringifyVocabularyItem)
    .join(', ')}`

  return (
    <VocabularyListItem
      key={JSON.stringify(vocabularyItem.id)}
      vocabularyItem={vocabularyItem}
      onPress={() => navigateToDetail(vocabularyItem)}
    >
      <>
        {showAlternatives && (
          <AlternativesContainer>
            <AlternativeWords {...hyphenated(alternatives)} />
          </AlternativesContainer>
        )}
      </>
    </VocabularyListItem>
  )
}

export default memo(DictionaryItem)
