import { RouteProp } from '@react-navigation/native'
import React, { ReactElement } from 'react'

import RouteWrapper from '../components/RouteWrapper'
import VocabularyDetail from '../components/VocabularyDetail'
import { RoutesParams } from '../navigation/NavigationTypes'

interface VocabularyDetailScreenProps {
  route: RouteProp<RoutesParams, 'VocabularyDetail'>
}

const VocabularyDetailScreen = ({ route }: VocabularyDetailScreenProps): ReactElement => {
  const { document } = route.params
  return (
    <RouteWrapper>
      <VocabularyDetail document={document} />
    </RouteWrapper>
  )
}

export default VocabularyDetailScreen
