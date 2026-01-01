import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import ListEmpty from '../../components/ListEmpty'
import RouteWrapper from '../../components/RouteWrapper'
import Title from '../../components/Title'
import { SubheadingText } from '../../components/text/Subheading'
import useRepetitionService from '../../hooks/useRepetitionService'
import VocabularyItem from '../../models/VocabularyItem'
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
  const repetitionVocabulary = repetitionService.getWordNodeCards()

  const { title, subtitle, empty } = getLabels().repetition.wordList

  const navigateToDetail = (vocabularyItem: VocabularyItem): void => {
    navigation.navigate('VocabularyDetail', { vocabularyItem })
  }

  const removeWordNodeCard = async (word: VocabularyItem): Promise<void> => {
    await repetitionService.removeWordNodeCard(word)
  }

  return (
    <RouteWrapper>
      <Root>
        <FlatList
          ListHeaderComponent={
            <Header>
              <Title title={title} description={wordsDescription(repetitionVocabulary.length)}>
                <Subtitle>{subtitle}</Subtitle>
              </Title>
            </Header>
          }
          data={repetitionVocabulary}
          showsVerticalScrollIndicator={false}
          keyExtractor={({ word }) => JSON.stringify(word.id)}
          renderItem={({ item }) => (
            <RepetitionListItem
              vocabularyItem={item.word}
              navigateToDetailScreen={() => navigateToDetail(item.word)}
              removeFromRepetition={() => removeWordNodeCard(item.word)}
            />
          )}
          ListEmptyComponent={<ListEmpty label={empty} />}
        />
      </Root>
    </RouteWrapper>
  )
}

export default RepetitionWordListScreen
