import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'

import VocabularyList from '../components/VocabularyList'
import { RoutesParams } from '../navigation/NavigationTypes'

interface VocabularyListScreenProps {
  route: RouteProp<RoutesParams, 'VocabularyList'>
  navigation: StackNavigationProp<RoutesParams, 'VocabularyList'>
}

const VocabularyListScreen = ({ route }: VocabularyListScreenProps): JSX.Element => (
  <VocabularyList documents={route.params.documents} />
)

export default VocabularyListScreen
