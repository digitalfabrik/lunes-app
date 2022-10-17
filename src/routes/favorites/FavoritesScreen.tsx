import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import RouteWrapper from '../../components/RouteWrapper'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import Title from '../../components/Title'
import { Favorite } from '../../constants/data'
import { Document } from '../../constants/endpoints'
import useLoadAsync from '../../hooks/useLoadAsync'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getFavorites } from '../../services/AsyncStorage'
import { getLabels } from '../../services/helpers'
import FavoriteItem from './components/FavoriteItem'

interface FavoritesScreenProps {
  route: RouteProp<RoutesParams, 'Favorites'>
  navigation: StackNavigationProp<RoutesParams, 'Favorites'>
}

const Root = styled.View`
  margin: 10px;
`

const FavoritesScreen = ({ navigation }: FavoritesScreenProps): ReactElement => {
  const { data, error, refresh } = useLoadAsync(getFavorites, {})

  useFocusEffect(refresh)

  const navigateToDetail = (document: Document): void => {
    navigation.navigate('VocabularyDetail', { document })
  }

  const renderItem = ({ item }: { item: Favorite }): JSX.Element => (
    <FavoriteItem favorite={item} refresh={refresh} onPress={navigateToDetail} />
  )

  return (
    <RouteWrapper>
      <Root>
        <ServerResponseHandler error={error} loading={false} refresh={refresh}>
          <FlatList
            ListHeaderComponent={
              <Title
                title={getLabels().favorites}
                description={`${data?.length ?? 0} ${
                  data?.length === 1 ? getLabels().general.word : getLabels().general.words
                }`}
              />
            }
            data={data}
            renderItem={renderItem}
          />
        </ServerResponseHandler>
      </Root>
    </RouteWrapper>
  )
}

export default FavoritesScreen
