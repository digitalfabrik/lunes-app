import { CommonActions } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import DisciplineListItem from '../../components/DisciplineListItem'
import RouteWrapper from '../../components/RouteWrapper'
import Title from '../../components/Title'
import { Discipline, VocabularyItem } from '../../constants/endpoints'
import useReadUserVocabulary from '../../hooks/useReadUserVocabulary'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels, wordsDescription } from '../../services/helpers'
import { spiltVocabularyIntoDisciplines } from './splitVocabularyToDiscipline'

const List = styled.FlatList`
  margin: 0 ${props => props.theme.spacings.md};
  height: 100%;
` as unknown as typeof FlatList

type DisciplineSelectionScreenProps = {
  navigation: StackNavigationProp<RoutesParams, 'UserVocabularyDisciplineSelection'>
}

export type DisciplineWithVocabulary = {
  discipline: Discipline
  vocabulary: VocabularyItem[]
}

const DisciplineSelectionScreen = ({ navigation }: DisciplineSelectionScreenProps): JSX.Element => {
  const userVocabulary = useReadUserVocabulary()
  const disciplinesWithVocabulary = spiltVocabularyIntoDisciplines(userVocabulary)

  const handleNavigation = (selectedDiscipline: number): void => {
    const selectedDisciplinesWithVocabulary = disciplinesWithVocabulary[selectedDiscipline]
    return navigation.navigate('SpecialExercises', {
      contentType: 'userVocabulary',
      discipline: selectedDisciplinesWithVocabulary.discipline,
      disciplineTitle: selectedDisciplinesWithVocabulary.discipline.title,
      vocabularyItems: selectedDisciplinesWithVocabulary.vocabulary,
      closeExerciseAction: CommonActions.goBack(),
    })
  }

  const renderListItem = ({ item }: { item: DisciplineWithVocabulary }): JSX.Element => (
    <DisciplineListItem item={item.discipline} onPress={() => handleNavigation(item.discipline.id)} />
  )

  return (
    <RouteWrapper>
      <List
        ListHeaderComponent={
          <Title
            title={getLabels().userVocabulary.overview.practice}
            description={wordsDescription(userVocabulary.length)}
          />
        }
        data={disciplinesWithVocabulary}
        renderItem={renderListItem}
        showsVerticalScrollIndicator={false}
      />
    </RouteWrapper>
  )
}

export default DisciplineSelectionScreen
