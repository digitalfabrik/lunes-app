import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import RouteWrapper from '../../components/RouteWrapper'
import { ContentSecondary } from '../../components/text/Content'
import { Favorite } from '../../constants/data'
import useStorage from '../../hooks/useStorage'
import VocabularyItem from '../../models/VocabularyItem'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { wordsDescription } from '../../services/helpers'
import FavoriteItem from './components/FavoriteItem'

type FavoritesScreenProps = {
  navigation: StackNavigationProp<RoutesParams, 'Favorites'>
}

const Root = styled.View`
  margin: 10px;
  margin: ${props => props.theme.spacings.sm};
`
const ListHeader = styled(ContentSecondary)`
  padding: ${props => props.theme.spacings.xs};
`

const FavoritesScreen = ({ navigation }: FavoritesScreenProps): ReactElement => {
  const [data] = useStorage('favorites')

  const navigateToDetail = (vocabularyItem: VocabularyItem): void => {
    navigation.navigate('VocabularyDetail', { vocabularyItem })
  }

  const renderItem = ({ item }: { item: Favorite }): JSX.Element => (
    <FavoriteItem favorite={item} onPress={navigateToDetail} />
  )

  return (
    <RouteWrapper>
      <Root>
        <FlatList
          ListHeaderComponent={<ListHeader>{wordsDescription(data.length)}</ListHeader>}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item: Favorite) => JSON.stringify(item)}
        />
      </Root>
    </RouteWrapper>
  )
}

export default FavoritesScreen
