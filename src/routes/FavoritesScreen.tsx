import { CommonActions, RouteProp, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'

import ServerResponseHandler from '../components/ServerResponseHandler'
import VocabularyList from '../components/VocabularyList'
import labels from '../constants/labels.json'
import useLoadAsync from '../hooks/useLoadAsync'
import { RoutesParams } from '../navigation/NavigationTypes'
import AsyncStorage from '../services/AsyncStorage'

interface FavoritesScreenProps {
  route: RouteProp<RoutesParams, 'Favorites'>
  navigation: StackNavigationProp<RoutesParams, 'Favorites'>
}

const FavoritesScreen = ({ navigation }: FavoritesScreenProps): JSX.Element => {
  const { data, refresh, error } = useLoadAsync(AsyncStorage.getFavorites, {})

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

  return (
    <ServerResponseHandler error={error} loading={false} refresh={refresh}>
      {data && (
        <VocabularyList
          title={labels.favorites.favorites}
          documents={data}
          onFavoritesChanged={refresh}
          onItemPress={onItemPress}
        />
      )}
    </ServerResponseHandler>
  )
}

export default FavoritesScreen
