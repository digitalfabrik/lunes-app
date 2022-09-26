import { CommonActions, RouteProp, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import RouteWrapper from '../components/RouteWrapper'
import ServerResponseHandler from '../components/ServerResponseHandler'
import VocabularyList from '../components/VocabularyList'
import useLoadFavorites from '../hooks/useLoadFavorites'
import { RoutesParams } from '../navigation/NavigationTypes'
import { getLabels } from '../services/helpers'

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
      disciplineTitle: getLabels().general.favorites,
      documents: data,
      documentIndex: index,
      closeExerciseAction: CommonActions.goBack(),
      labelOverrides: {
        closeExerciseButtonLabel: getLabels().exercises.cancelModal.cancel,
        closeExerciseHeaderLabel: getLabels().general.back,
        isCloseButton: false,
      },
    })
  }

  return (
    <RouteWrapper>
      <ServerResponseHandler error={error} loading={false} refresh={refresh}>
        {data && (
          <VocabularyList
            title={getLabels().favorites}
            vocabularyItems={data}
            onFavoritesChanged={refresh}
            onItemPress={onItemPress}
          />
        )}
      </ServerResponseHandler>
    </RouteWrapper>
  )
}

export default FavoritesScreen
