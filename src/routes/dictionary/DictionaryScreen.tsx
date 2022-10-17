import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useState } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import ListEmpty from '../../components/ListEmpty'
import RouteWrapper from '../../components/RouteWrapper'
import SearchBar from '../../components/SearchBar'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import Title from '../../components/Title'
import { Document } from '../../constants/endpoints'
import useLoadAllDocuments from '../../hooks/useLoadAllDocuments'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels, getSortedAndFilteredDocuments, matchAlternative } from '../../services/helpers'
import DictionaryItem from './components/DictionaryItem'

const Root = styled.View`
  padding: 0 ${props => props.theme.spacings.sm};
`

const Header = styled.View`
  padding-bottom: ${props => props.theme.spacings.md};
`

interface DictionaryScreenProps {
  navigation: StackNavigationProp<RoutesParams, 'Dictionary'>
}

const DictionaryScreen = ({ navigation }: DictionaryScreenProps): ReactElement => {
  const documents = useLoadAllDocuments()
  const [searchString, setSearchString] = useState<string>('')

  const sortedAndFilteredDocuments = getSortedAndFilteredDocuments(documents.data, searchString)

  const description = `${sortedAndFilteredDocuments.length} ${
    sortedAndFilteredDocuments.length === 1 ? getLabels().general.word : getLabels().general.words
  }`

  const navigateToDetail = (document: Document): void => {
    navigation.navigate('VocabularyDetail', { document })
  }

  return (
    <RouteWrapper>
      <ServerResponseHandler error={documents.error} loading={documents.loading} refresh={documents.refresh}>
        <Root>
          {documents.data && (
            <FlatList
              keyboardShouldPersistTaps='handled'
              ListHeaderComponent={
                <Header>
                  <Title title={getLabels().general.dictionary} description={description} />
                  <SearchBar query={searchString} setQuery={setSearchString} />
                </Header>
              }
              data={sortedAndFilteredDocuments}
              renderItem={({ item }) => (
                <DictionaryItem
                  document={item}
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

export default DictionaryScreen
