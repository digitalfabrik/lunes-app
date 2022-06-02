import { CommonActions, RouteProp, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactNode } from 'react'

import VocabularyList from '../components/VocabularyList'
import labels from '../constants/labels.json'
import useLoadAsync from '../hooks/useLoadAsync'
import { RoutesParams } from '../navigation/NavigationTypes'
import AsyncStorage from '../services/AsyncStorage'

interface FavoritesScreenProps {
  route: RouteProp<RoutesParams, 'Favorites'>
  navigation: StackNavigationProp<RoutesParams, 'Favorites'>
}

const FavoritesScreen = ({ navigation }: FavoritesScreenProps): ReactNode => {
  const { data, refresh } = useLoadAsync(AsyncStorage.getFavorites, {})

  useFocusEffect(refresh)

  const onItemPress = (index: number) => {
    if (!data) {
      return
    }
    navigation.navigate('VocabularyDetail', {
      disciplineId: 0,
      disciplineTitle: labels.general.favorites,
      documents: data,
      documentIndex: index,
      closeExerciseAction: CommonActions.goBack()
    })
  }

  if (!data) {
    return null
  }

  return (
    <VocabularyList title={labels.favorites} documents={data} onFavoritesChanged={refresh} onItemPress={onItemPress} />
  )
}

export default FavoritesScreen
