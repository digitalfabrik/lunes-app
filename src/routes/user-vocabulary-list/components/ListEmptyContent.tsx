import React, { ReactElement } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import ListEmpty from '../../../components/ListEmpty'
import Loading from '../../../components/Loading'
import { VocabularyItem } from '../../../constants/endpoints'
import { Return } from '../../../hooks/useLoadAsync'
import { getLabels } from '../../../services/helpers'

const EmptyContainer = styled.View`
  height: ${wp('20%')}px;
`

interface Props {
  documents: Return<VocabularyItem[]>
}

const ListEmptyContent = ({ documents }: Props): ReactElement => {
  if (documents.loading) {
    return (
      <EmptyContainer>
        <Loading isLoading={documents.loading} />
      </EmptyContainer>
    )
  }
  return documents.data?.length === 0 ? (
    <ListEmpty label={getLabels().userVocabulary.list.noWordsYet} />
  ) : (
    <ListEmpty label={getLabels().general.noResults} />
  )
}

export default ListEmptyContent
