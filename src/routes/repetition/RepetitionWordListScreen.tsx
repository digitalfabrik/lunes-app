import { useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useMemo } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import ListEmpty from '../../components/ListEmpty'
import Loading from '../../components/Loading'
import RouteWrapper from '../../components/RouteWrapper'
import Title from '../../components/Title'
import { SubheadingText } from '../../components/text/Subheading'
import { loadAllWords } from '../../hooks/useLoadAllWords'
import useLoadAsync from '../../hooks/useLoadAsync'
import useRepetitionService from '../../hooks/useRepetitionService'
import { useStorageCache } from '../../hooks/useStorage'
import VocabularyItem, { VocabularyItemId } from '../../models/VocabularyItem'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { RepetitionService } from '../../services/RepetitionService'
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
  const storageCache = useStorageCache()
  const { data: allVocabulary, refresh } = useLoadAsync(loadAllWords, storageCache)
  useFocusEffect(refresh)

  const cardsWithVocabulary = useMemo(
    () =>
      allVocabulary !== null
        ? RepetitionService.attachVocabularyToCards(repetitionService.getWordNodeCards(), allVocabulary)
        : null,
    [allVocabulary, repetitionService],
  )

  const { title, subtitle, empty } = getLabels().repetition.wordList

  const navigateToDetail = (vocabularyItem: VocabularyItem): void => {
    navigation.navigate('VocabularyDetail', { vocabularyItem })
  }

  const removeWordNodeCard = async (wordId: VocabularyItemId): Promise<void> => {
    await repetitionService.removeWordNodeCard(wordId)
  }

  return (
    <RouteWrapper>
      <Loading isLoading={cardsWithVocabulary === null}>
        <Root>
          <FlatList
            ListHeaderComponent={
              <Header>
                <Title title={title} description={wordsDescription(cardsWithVocabulary?.length ?? 0)}>
                  <Subtitle>{subtitle}</Subtitle>
                </Title>
              </Header>
            }
            data={cardsWithVocabulary ?? []}
            showsVerticalScrollIndicator={false}
            keyExtractor={({ wordId }) => JSON.stringify(wordId)}
            renderItem={({ item }) => (
              <RepetitionListItem
                vocabularyItem={item.word}
                navigateToDetailScreen={() => navigateToDetail(item.word)}
                removeFromRepetition={() => removeWordNodeCard(item.word.id)}
              />
            )}
            ListEmptyComponent={<ListEmpty label={empty} />}
          />
        </Root>
      </Loading>
    </RouteWrapper>
  )
}

export default RepetitionWordListScreen
