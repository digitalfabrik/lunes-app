import { RouteProp } from '@react-navigation/native'
import React, { ReactElement } from 'react'

import RouteWrapper from '../components/RouteWrapper'
import VocabularyDetail from '../components/VocabularyDetail'
import { RoutesParams } from '../navigation/NavigationTypes'

interface Props {
  route: RouteProp<RoutesParams, 'DictionaryDetail'>
}

const DictionaryDetailScreen = ({ route }: Props): ReactElement => {
  const { document } = route.params
  return (
    <RouteWrapper>
      <VocabularyDetail document={document} />
    </RouteWrapper>
  )
}

export default DictionaryDetailScreen
