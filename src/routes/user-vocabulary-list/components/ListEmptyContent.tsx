import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import ListEmpty from '../../../components/ListEmpty'
import { ContentSecondary } from '../../../components/text/Content'
import VocabularyItem from '../../../models/VocabularyItem'
import { getLabels } from '../../../services/helpers'

const Container = styled.View`
  padding-top: ${props => props.theme.spacings.xl};
`

const Hint = styled(ContentSecondary)`
  text-align: center;
  padding: 0 ${props => props.theme.spacings.md};
`

type ListEmptyContentProps = {
  vocabularyItems: readonly VocabularyItem[]
}

const ListEmptyContent = ({ vocabularyItems }: ListEmptyContentProps): ReactElement => {
  const hasNoWords = vocabularyItems.length === 0
  const { noWordsYet, noWordsYetHint } = getLabels().userVocabulary.list

  return (
    <Container>
      <ListEmpty label={hasNoWords ? noWordsYet : getLabels().general.noResults} />
      {hasNoWords && <Hint>{noWordsYetHint}</Hint>}
    </Container>
  )
}

export default ListEmptyContent
