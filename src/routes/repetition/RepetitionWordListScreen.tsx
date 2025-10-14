import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import ListEmpty from '../../components/ListEmpty'
import RouteWrapper from '../../components/RouteWrapper'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import Title from '../../components/Title'
import { SubheadingText } from '../../components/text/Subheading'
import useLoadVocabularyItemRefs from '../../hooks/useLoadVocabularyItemRefs'
import useRepetitionService from '../../hooks/useRepetitionService'
import VocabularyItem from '../../model/VocabularyItem'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels, wordsDescription } from '../../services/helpers'
import RepetitionListItem from './components/RepetitionListItem'

const Root = styled.View`
  padding: 0 ${props => props.theme.spacings.sm};
`

const Header = styled.View`
  padding-bottom: ${props => props.theme.spacings.md};
`

const Subtitle = styled(SubheadingText)`
  margin-top: ${theme => theme.theme.spacings.md};
  text-align: center;
`

type RepetitionWordListScreenProps = {
  navigation: StackNavigationProp<RoutesParams, 'RepetitionWordList'>
}

const RepetitionWordListScreen = ({ navigation }: RepetitionWordListScreenProps): ReactElement => {
  const repetitionService = useRepetitionService()
  const wordNodeCards = repetitionService.getWordNodeCards()
  const {
    data: vocabulary,
    error,
    loading,
    refresh,
  } = useLoadVocabularyItemRefs(wordNodeCards.map(card => card.wordRef))

  const { title, subtitle, empty } = getLabels().repetition.wordList

  const navigateToDetail = (vocabularyItem: VocabularyItem): void => {
    navigation.navigate('VocabularyDetail', { vocabularyItem })
  }

  const removeWordNodeCard = async (word: VocabularyItem): Promise<void> => {
    await repetitionService.removeWordNodeCard(word.ref)
  }

  return (
    <RouteWrapper>
      <Root>
        <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
          {vocabulary != null && (
            <FlatList
              ListHeaderComponent={
                <Header>
                  <Title title={title} description={wordsDescription(vocabulary.length)}>
                    <Subtitle>{subtitle}</Subtitle>
                  </Title>
                </Header>
              }
              data={vocabulary}
              showsVerticalScrollIndicator={false}
              keyExtractor={word => JSON.stringify(word.ref)}
              renderItem={({ item }) => (
                <RepetitionListItem
                  vocabularyItem={item}
                  navigateToDetailScreen={() => navigateToDetail(item)}
                  removeFromRepetition={() => removeWordNodeCard(item)}
                />
              )}
              ListEmptyComponent={<ListEmpty label={empty} />}
            />
          )}
        </ServerResponseHandler>
      </Root>
    </RouteWrapper>
  )
}

export default RepetitionWordListScreen
