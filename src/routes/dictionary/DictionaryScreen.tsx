import { StackNavigationProp } from '@react-navigation/stack'
import normalizeStrings from 'normalize-strings'
import React, { ReactElement, useState } from 'react'
import { FlatList } from 'react-native'
import { Subheading } from 'react-native-paper'
import styled from 'styled-components/native'

import { SadSmileyIcon } from '../../../assets/images'
import RouteWrapper from '../../components/RouteWrapper'
import SearchBar from '../../components/SearchBar'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import Title from '../../components/Title'
import { ARTICLES } from '../../constants/data'
import { Document } from '../../constants/endpoints'
import labels from '../../constants/labels.json'
import useLoadAllDocuments from '../../hooks/useLoadAllDocuments'
import { RoutesParams } from '../../navigation/NavigationTypes'
import DictionaryItem from './components/DictionaryItem'

const Root = styled.View`
  padding: 0 ${props => props.theme.spacings.sm};
`

const ListEmptyContainer = styled.View`
  align-items: center;
  padding: ${props => props.theme.spacings.sm} 0;
`

const StyledSadSmileyIcon = styled(SadSmileyIcon)`
  padding: ${props => props.theme.spacings.md} 0;
`

const Header = styled.View`
  padding-bottom: ${props => props.theme.spacings.md};
`

interface Props {
  navigation: StackNavigationProp<RoutesParams, 'Dictionary'>
}

const DictionaryScreen = ({ navigation }: Props): ReactElement => {
  const documents = useLoadAllDocuments()
  const [searchString, setSearchString] = useState<string>('')

  const searchStringWithoutArticle = ARTICLES.map(article => article.value).includes(
    searchString.split(' ')[0].toLowerCase()
  )
    ? searchString.substring(searchString.indexOf(' ') + 1)
    : searchString
  const normalizedSearchString = normalizeStrings(searchStringWithoutArticle).toLowerCase().trim()

  const matchAlternative = (document: Document): boolean =>
    document.alternatives.filter(alternative => alternative.word.toLowerCase().includes(normalizedSearchString))
      .length > 0

  const filteredDocuments = documents.data?.filter(
    item => item.word.toLowerCase().includes(normalizedSearchString) || matchAlternative(item)
  )
  const sortedDocuments = filteredDocuments?.sort((a, b) => a.word.localeCompare(b.word))

  const description = `${filteredDocuments?.length ?? 0} ${
    (filteredDocuments?.length ?? 0) === 1 ? labels.general.word : labels.general.words
  }`

  const navigateToDetail = (document: Document): void => {
    navigation.navigate('DictionaryDetail', { document })
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
                  <Title title={labels.general.dictionary} description={description} />
                  <SearchBar query={searchString} setQuery={setSearchString} />
                </Header>
              }
              data={sortedDocuments}
              renderItem={({ item }) => (
                <DictionaryItem
                  document={item}
                  showAlternatives={matchAlternative(item) && searchString.length > 0}
                  navigateToDetail={navigateToDetail}
                />
              )}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <ListEmptyContainer>
                  <StyledSadSmileyIcon />
                  <Subheading>{labels.dictionary.noResults}</Subheading>
                </ListEmptyContainer>
              }
            />
          )}
        </Root>
      </ServerResponseHandler>
    </RouteWrapper>
  )
}

export default DictionaryScreen
