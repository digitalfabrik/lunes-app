import { RouteProp } from '@react-navigation/native'
import React, { ReactElement } from 'react'

import RouteWrapper from '../components/RouteWrapper'
import VocabularyDetail from '../components/VocabularyDetail'
import { RoutesParams } from '../navigation/NavigationTypes'

type VocabularyDetailScreenProps = {
  route: RouteProp<RoutesParams, 'VocabularyDetail'>
}

const VocabularyDetailScreen = ({ route }: VocabularyDetailScreenProps): ReactElement => {
  const { vocabularyItem } = route.params
  return (
    <RouteWrapper>
      <VocabularyDetail vocabularyItem={vocabularyItem} />
    </RouteWrapper>
  )
}

export default VocabularyDetailScreen
