import React, { ReactElement } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import ListEmpty from '../../../components/ListEmpty'
import Loading from '../../../components/Loading'
import { Document } from '../../../constants/endpoints'
import { Return } from '../../../hooks/useLoadAsync'
import { getLabels } from '../../../services/helpers'

const EmptyContainer = styled.View`
  height: ${hp('11%')}px;
`

interface ListEmptyContentProps {
  documents: Return<Document[]>
}

const ListEmptyContent = ({ documents }: ListEmptyContentProps): ReactElement => {
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
