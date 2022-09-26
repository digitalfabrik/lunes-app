import { RouteProp } from '@react-navigation/native'
import React, { ReactElement } from 'react'

import RouteWrapper from '../components/RouteWrapper'
import VocabularyDetail from '../components/VocabularyDetail'
import { RoutesParams } from '../navigation/NavigationTypes'

interface Props {
  route: RouteProp<RoutesParams, 'DictionaryDetail'>
}

const VocabularyDetailScreen = ({ route }: Props): ReactElement => {
  const { document } = route.params // TODO: auf Route configuration überprüfen
  return (
    <RouteWrapper>
      <VocabularyDetail vocabularyItem={document} />
    </RouteWrapper>
  )
}

export default VocabularyDetailScreen
