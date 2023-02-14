import React, { ReactElement } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import ListEmpty from '../../../components/ListEmpty'
import Loading from '../../../components/Loading'
import { VocabularyItem } from '../../../constants/endpoints'
import { Return } from '../../../hooks/useLoadAsync'
import { getLabels } from '../../../services/helpers'

const LoadingContainer = styled.View`
  height: ${hp('10%')}px;
`

const Container = styled.View`
  padding-top: ${props => props.theme.spacings.xl};
`

type ListEmptyContentProps = {
  vocabularyItems: Return<VocabularyItem[]>
}

const ListEmptyContent = ({ vocabularyItems }: ListEmptyContentProps): ReactElement =>
  vocabularyItems.loading ? (
    <LoadingContainer>
      <Loading isLoading={vocabularyItems.loading} />
    </LoadingContainer>
  ) : (
    <Container>
      <ListEmpty
        label={
          vocabularyItems.data?.length === 0
            ? getLabels().userVocabulary.list.noWordsYet
            : getLabels().general.noResults
        }
      />
    </Container>
  )

export default ListEmptyContent
