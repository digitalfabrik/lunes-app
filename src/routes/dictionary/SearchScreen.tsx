import { useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useState } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import ListEmpty from '../../components/ListEmpty'
import RouteWrapper from '../../components/RouteWrapper'
import SearchBar from '../../components/SearchBar'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import Title from '../../components/Title'
import { VocabularyItem } from '../../constants/endpoints'
import useGetAllWords from '../../hooks/useGetAllWords'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels, getSortedAndFilteredVocabularyItems, matchAlternative } from '../../services/helpers'
import SearchResultItem from './components/SearchResultItem'

const Root = styled.View`
  padding: 0 ${props => props.theme.spacings.sm};
`

const Header = styled.View`
  padding-bottom: ${props => props.theme.spacings.md};
`

type SearchScreenProps = {
  navigation: StackNavigationProp<RoutesParams, 'Search'>
}

const SearchScreen = ({ navigation }: SearchScreenProps): ReactElement => {
  const vocabularyItems = useGetAllWords()
  const [searchString, setSearchString] = useState<string>('')

  useFocusEffect(vocabularyItems.refresh)

  const sortedAndFilteredVocabularyItems = getSortedAndFilteredVocabularyItems(vocabularyItems.data, searchString)

  const description = `${sortedAndFilteredVocabularyItems.length} ${
    sortedAndFilteredVocabularyItems.length === 1 ? getLabels().general.word : getLabels().general.words
  }`

  const navigateToDetail = (vocabularyItem: VocabularyItem): void => {
    navigation.navigate('VocabularyDetail', { vocabularyItem })
  }

  return (
    <RouteWrapper>
      <ServerResponseHandler
        error={vocabularyItems.error}
        loading={vocabularyItems.loading}
        refresh={vocabularyItems.refresh}>
        <Root>
          {vocabularyItems.data && (
            <FlatList
              keyboardShouldPersistTaps='handled'
              ListHeaderComponent={
                <Header>
                  <Title title={getLabels().general.search} description={description} />
                  <SearchBar query={searchString} setQuery={setSearchString} />
                </Header>
              }
              data={sortedAndFilteredVocabularyItems}
              renderItem={({ item }) => (
                <SearchResultItem
                  vocabularyItem={item}
                  showAlternatives={matchAlternative(item, searchString) && searchString.length > 0}
                  navigateToDetail={navigateToDetail}
                />
              )}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={<ListEmpty label={getLabels().general.noResults} />}
            />
          )}
        </Root>
      </ServerResponseHandler>
    </RouteWrapper>
  )
}

export default SearchScreen
