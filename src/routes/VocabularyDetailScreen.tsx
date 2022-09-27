import { RouteProp } from '@react-navigation/native'
import React, { ReactElement } from 'react'

import RouteWrapper from '../components/RouteWrapper'
import VocabularyDetail from '../components/VocabularyDetail'
import { RoutesParams } from '../navigation/NavigationTypes'

interface Props {
  route: RouteProp<RoutesParams, 'DictionaryDetail'>
}

const VocabularyDetailScreen = ({ route }: Props): ReactElement => {
  const { vocabularyItem } = route.params
  return (
    <RouteWrapper>
      <VocabularyDetail vocabularyItem={vocabularyItem} />
    </RouteWrapper>
  )
}

export default VocabularyDetailScreen
