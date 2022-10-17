import React, { ReactElement } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import ListEmpty from '../../../components/ListEmpty'
import Loading from '../../../components/Loading'
import { VocabularyItem } from '../../../constants/endpoints'
import { Return } from '../../../hooks/useLoadAsync'
import { getLabels } from '../../../services/helpers'

const EmptyContainer = styled.View`
  height: ${hp('10%')}px;
`

interface ListEmptyContentProps {
  vocabularyItems: Return<VocabularyItem[]>
}

const ListEmptyContent = ({ vocabularyItems }: ListEmptyContentProps): ReactElement => {
  if (vocabularyItems.loading) {
    return (
      <EmptyContainer>
        <Loading isLoading={vocabularyItems.loading} />
      </EmptyContainer>
    )
  }
  return vocabularyItems.data?.length === 0 ? (
    <ListEmpty label={getLabels().userVocabulary.list.noWordsYet} />
  ) : (
    <ListEmpty label={getLabels().general.noResults} />
  )
}

export default ListEmptyContent
