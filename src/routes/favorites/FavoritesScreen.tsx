import { useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useCallback, useMemo } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import ErrorMessage from '../../components/ErrorMessage'
import Loading from '../../components/Loading'
import RouteWrapper from '../../components/RouteWrapper'
import VocabularyListItem from '../../components/VocabularyListItem'
import { ContentSecondary } from '../../components/text/Content'
import { SubheadingPrimary } from '../../components/text/Subheading'
import useLoadAllWords from '../../hooks/useLoadAllWords'
import useStorage, { useStorageCache } from '../../hooks/useStorage'
import VocabularyItem, { serializeVocabularyItemId } from '../../models/VocabularyItem'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels, wordsDescription } from '../../services/helpers'
import { reportError } from '../../services/sentry'
import { removeFavoritesOfDeletedUserVocabulary } from '../../services/storageUtils'

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
  const [userVocabulary] = useStorage('userVocabulary')
  const storageCache = useStorageCache()
  const { data: allWords, error, loading, refresh } = useLoadAllWords()

  useFocusEffect(
    useCallback(() => {
      refresh()
      removeFavoritesOfDeletedUserVocabulary(storageCache).catch(reportError)
    }, [refresh, storageCache]),
  )

  // useLoadAllWords returns the user vocabulary as well, but only after a successful request
  const favoriteItems = useMemo(() => {
    const wordsById = new Map(
      [...userVocabulary, ...(allWords ?? [])].map(word => [serializeVocabularyItemId(word.id), word]),
    )
    return favorites
      .map(favorite => wordsById.get(serializeVocabularyItemId(favorite)))
      .filter((item): item is VocabularyItem => item !== undefined)
  }, [favorites, userVocabulary, allWords])

  const hasUnresolvedFavorites = !loading && favoriteItems.length < favorites.length
  const hasNothingToShow = favorites.length > 0 && favoriteItems.length === 0

  const navigateToDetail = (vocabularyItem: VocabularyItem): void => {
    navigation.navigate('VocabularyDetail', { vocabularyItem })
  }

  const renderItem = ({ item }: { item: VocabularyItem }): ReactElement => (
    <VocabularyListItem vocabularyItem={item} onPress={() => navigateToDetail(item)} />
  )

  const labels = getLabels().favorites

  return (
    <RouteWrapper>
      <Root>
        <Loading isLoading={loading && hasNothingToShow}>
          <FlatList
            ListHeaderComponent={
              <>
                <ListHeader>{wordsDescription(favoriteItems.length)}</ListHeader>
                <ErrorMessage
                  error={hasUnresolvedFavorites ? (error ?? new Error(labels.loadingError)) : null}
                  refresh={refresh}
                  contained
                />
              </>
            }
            ListEmptyComponent={
              favorites.length === 0 ? (
                <EmptyStateContainer>
                  <EmptyStateTitle>{labels.emptyState.title}</EmptyStateTitle>
                  <EmptyStateSubtitle>{labels.emptyState.subtitle}</EmptyStateSubtitle>
                </EmptyStateContainer>
              ) : null
            }
            data={favoriteItems}
            renderItem={renderItem}
            keyExtractor={(item: VocabularyItem) => serializeVocabularyItemId(item.id)}
          />
        </Loading>
      </Root>
    </RouteWrapper>
  )
}

export default FavoritesScreen
