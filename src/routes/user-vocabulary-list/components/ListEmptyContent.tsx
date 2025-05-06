import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import ListEmpty from '../../../components/ListEmpty'
import { VocabularyItem } from '../../../constants/endpoints'
import { getLabels } from '../../../services/helpers'

const Container = styled.View`
  padding-top: ${props => props.theme.spacings.xl};
`

type ListEmptyContentProps = {
  vocabularyItems: VocabularyItem[]
}

const ListEmptyContent = ({ vocabularyItems }: ListEmptyContentProps): ReactElement => (
  <Container>
    <ListEmpty
      label={vocabularyItems.length === 0 ? getLabels().userVocabulary.list.noWordsYet : getLabels().general.noResults}
    />
  </Container>
)

export default ListEmptyContent
