import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import RouteWrapper from '../../components/RouteWrapper'
import { ContentSecondary } from '../../components/text/Content'
import { Favorite } from '../../constants/data'
import { VocabularyItem } from '../../constants/endpoints'
import useStorage from '../../hooks/useStorage'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels } from '../../services/helpers'
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
  const description = `${data.length} ${data.length === 1 ? getLabels().general.word : getLabels().general.words}`

  const navigateToDetail = (vocabularyItem: VocabularyItem): void => {
    navigation.navigate('VocabularyDetail', { vocabularyItem })
  }

  const renderItem = ({ item }: { item: Favorite }): JSX.Element => (
    <FavoriteItem favorite={item} onPress={navigateToDetail} />
  )

  return (
    <RouteWrapper>
      <Root>
        <FlatList ListHeaderComponent={<ListHeader>{description}</ListHeader>} data={data} renderItem={renderItem} />
      </Root>
    </RouteWrapper>
  )
}

export default FavoritesScreen
