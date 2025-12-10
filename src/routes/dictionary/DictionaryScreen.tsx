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
import useLoadAllWords from '../../hooks/useLoadAllWords'
import VocabularyItem from '../../models/VocabularyItem'
import { RoutesParams } from '../../navigation/NavigationTypes'
import {
  getLabels,
  getSortedAndFilteredVocabularyItems,
  matchAlternative,
  wordsDescription,
} from '../../services/helpers'
import DictionaryItem from './components/DictionaryItem'

const Root = styled.View`
  padding: 0 ${props => props.theme.spacings.sm};
`

const Header = styled.View`
  padding-bottom: ${props => props.theme.spacings.md};
`

type DictionaryScreenProps = {
  navigation: StackNavigationProp<RoutesParams, 'Dictionary'>
}

const DictionaryScreen = ({ navigation }: DictionaryScreenProps): ReactElement => {
  const vocabularyItems = useLoadAllWords()
  const [searchString, setSearchString] = useState<string>('')

  useFocusEffect(vocabularyItems.refresh)

  const sortedAndFilteredVocabularyItems = getSortedAndFilteredVocabularyItems(vocabularyItems.data, searchString)

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
                  <Title
                    title={getLabels().general.dictionary}
                    description={wordsDescription(sortedAndFilteredVocabularyItems.length)}
                  />
                  <SearchBar query={searchString} setQuery={setSearchString} />
                </Header>
              }
              data={sortedAndFilteredVocabularyItems}
              renderItem={({ item }) => (
                <DictionaryItem
                  vocabularyItem={item}
                  showAlternatives={matchAlternative(item, searchString) && searchString.length > 0}
                  navigateToDetail={navigateToDetail}
                />
              )}
              keyExtractor={({ id }) => JSON.stringify(id)}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={<ListEmpty label={getLabels().general.noResults} />}
            />
          )}
        </Root>
      </ServerResponseHandler>
    </RouteWrapper>
  )
}

export default DictionaryScreen
