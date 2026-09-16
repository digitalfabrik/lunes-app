import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import RouteWrapper from '../../components/RouteWrapper'
import VocabularyListItem from '../../components/VocabularyListItem'
import { ContentSecondary } from '../../components/text/Content'
import { SubheadingPrimary } from '../../components/text/Subheading'
import useLoadAllWords from '../../hooks/useLoadAllWords'
import useStorage from '../../hooks/useStorage'
import VocabularyItem, { areVocabularyItemIdsEqual, serializeVocabularyItemId } from '../../models/VocabularyItem'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels, wordsDescription } from '../../services/helpers'

type FavoritesScreenProps = {
  navigation: StackNavigationProp<RoutesParams, 'Favorites'>
}

const Root = styled.View`
  margin: ${props => props.theme.spacings.sm};
`
const ListHeader = styled(ContentSecondary)`
  padding: ${props => props.theme.spacings.xs};
`

const EmptyStateContainer = styled.View`
  align-items: center;
  padding: ${props => props.theme.spacings.lg} ${props => props.theme.spacings.sm};
`

const EmptyStateTitle = styled(SubheadingPrimary)`
  text-align: center;
  margin-bottom: ${props => props.theme.spacings.xs};
`

const EmptyStateSubtitle = styled.Text`
  color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${props => props.theme.fonts.defaultFontSize};
  text-align: center;
`

const FavoritesScreen = ({ navigation }: FavoritesScreenProps): ReactElement => {
  const [favorites] = useStorage('favorites')
  const { data: allWords } = useLoadAllWords()

  const favoriteItems = favorites
    .map(favorite => allWords?.find(word => areVocabularyItemIdsEqual(word.id, favorite)))
    .filter((item): item is VocabularyItem => item !== undefined)

  const navigateToDetail = (vocabularyItem: VocabularyItem): void => {
    navigation.navigate('VocabularyDetail', { vocabularyItem })
  }

  const renderItem = ({ item }: { item: VocabularyItem }): ReactElement => (
    <VocabularyListItem vocabularyItem={item} onPress={() => navigateToDetail(item)} />
  )

  const { emptyState } = getLabels().favorites

  return (
    <RouteWrapper>
      <Root>
        <FlatList
          ListHeaderComponent={<ListHeader>{wordsDescription(favorites.length)}</ListHeader>}
          ListEmptyComponent={
            favorites.length === 0 ? (
              <EmptyStateContainer>
                <EmptyStateTitle>{emptyState.title}</EmptyStateTitle>
                <EmptyStateSubtitle>{emptyState.subtitle}</EmptyStateSubtitle>
              </EmptyStateContainer>
            ) : null
          }
          data={favoriteItems}
          renderItem={renderItem}
          keyExtractor={(item: VocabularyItem) => serializeVocabularyItemId(item.id)}
        />
      </Root>
    </RouteWrapper>
  )
}

export default FavoritesScreen
