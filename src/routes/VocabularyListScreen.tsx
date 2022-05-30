import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'

import VocabularyList from '../components/VocabularyList'
import { RoutesParams } from '../navigation/NavigationTypes'

interface VocabularyListScreenProps {
  route: RouteProp<RoutesParams, 'VocabularyList'>
  navigation: StackNavigationProp<RoutesParams, 'VocabularyList'>
}

const VocabularyListScreen = ({ route, navigation }: VocabularyListScreenProps): JSX.Element => {
  const onItemPress = (index: number) =>
    navigation.navigate('VocabularyDetail', { ...route.params, documentIndex: index })
  return <VocabularyList documents={route.params.documents} onItemPress={onItemPress} />
}

export default VocabularyListScreen
