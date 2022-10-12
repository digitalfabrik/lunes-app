import { CommonActions, RouteProp, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useEffect, useState } from 'react'
import { FlatList } from 'react-native'

import RouteWrapper from '../../components/RouteWrapper'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import Title from '../../components/Title'
import VocabularyList from '../../components/VocabularyList'
import VocabularyListItem from '../../components/VocabularyListItem'
import { Favorite } from '../../constants/data'
import { Document } from '../../constants/endpoints'
import useLoadAsync from '../../hooks/useLoadAsync'
import useLoadFavorite, { loadFavorite } from '../../hooks/useLoadFavorite'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getFavorites } from '../../services/AsyncStorage'
import { getLabels } from '../../services/helpers'
import { reportError } from '../../services/sentry'

interface FavoritesScreenProps {
  route: RouteProp<RoutesParams, 'Favorites'>
  navigation: StackNavigationProp<RoutesParams, 'Favorites'>
}

const FavoritesScreen = ({ navigation }: FavoritesScreenProps): ReactElement => {
  // await favorties = getFavorites()
  const { data, error, refresh } = useLoadAsync(getFavorites, {})
  const [documents, setDocuments] = useState<Document[]>([])

  useFocusEffect(refresh)

  useEffect(() => {
    const d: Document[] = []
    data?.forEach(item => {
      loadFavorite(item)
        .then(result => {
          if (result) {
            d.push(result)
          }
        })
        .catch(reportError)
    })
    setDocuments(d)
  }, [data])

  const onItemPress = (index: number) => {
    if (!data) {
      return
    }
    navigation.navigate('VocabularyDetail', {
      disciplineId: null,
      disciplineTitle: getLabels().general.favorites,
      documents: documents,
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
        {documents && <VocabularyList documents={documents} onItemPress={onItemPress} title={'test'} />}
      </ServerResponseHandler>
    </RouteWrapper>
  )
}

export default FavoritesScreen
