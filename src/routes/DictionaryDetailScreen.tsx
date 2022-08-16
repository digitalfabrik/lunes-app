import { RouteProp } from '@react-navigation/native'
import React from 'react'

import RouteWrapper from '../components/RouteWrapper'
import VocabularyDetailView from '../components/VocabularyDetailView'
import { RoutesParams } from '../navigation/NavigationTypes'

interface Props {
  route: RouteProp<RoutesParams, 'DictionaryDetail'>
}

const DictionaryDetailScreen = ({ route }: Props) => {
  const { document } = route.params
  return (
    <RouteWrapper>
      <VocabularyDetailView document={document} />
    </RouteWrapper>
  )
}

export default DictionaryDetailScreen
