import { CommonActions, RouteProp, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import RouteWrapper from '../components/RouteWrapper'
import ServerResponseHandler from '../components/ServerResponseHandler'
import VocabularyList from '../components/VocabularyList'
import labels from '../constants/labels.json'
import useLoadFavorites from '../hooks/useLoadFavorites'
import { RoutesParams } from '../navigation/NavigationTypes'

interface FavoritesScreenProps {
  route: RouteProp<RoutesParams, 'Favorites'>
  navigation: StackNavigationProp<RoutesParams, 'Favorites'>
}

const FavoritesScreen = ({ navigation }: FavoritesScreenProps): ReactElement => {
  const { data, error, refresh } = useLoadFavorites()

  useFocusEffect(refresh)

  const onItemPress = (index: number) => {
    if (!data) {
      return
    }
    navigation.navigate('VocabularyDetail', {
      disciplineId: null,
      disciplineTitle: labels.general.favorites,
      documents: data,
      documentIndex: index,
      closeExerciseAction: CommonActions.goBack(),
    })
  }

  return (
    <RouteWrapper>
      <ServerResponseHandler error={error} loading={false} refresh={refresh}>
        {data && (
          <VocabularyList
            title={labels.favorites}
            documents={data}
            onFavoritesChanged={refresh}
            onItemPress={onItemPress}
          />
        )}
      </ServerResponseHandler>
    </RouteWrapper>
  )
}

export default FavoritesScreen
