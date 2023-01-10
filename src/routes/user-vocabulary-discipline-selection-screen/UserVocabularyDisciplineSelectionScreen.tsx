import { CommonActions } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import DisciplineListItem from '../../components/DisciplineListItem'
import RouteWrapper from '../../components/RouteWrapper'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import Title from '../../components/Title'
import { Discipline, VocabularyItem } from '../../constants/endpoints'
import useReadUserVocabulary from '../../hooks/useReadUserVocabulary'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels, wordsDescription } from '../../services/helpers'
import { spiltVocabularyToDisciplines } from './splitVocabularyToDiscipline'

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
  const { data, error, loading, refresh } = useReadUserVocabulary()
  const [disciplinesWithVocabulary, setDisciplinesWithVocabulary] = useState<DisciplineWithVocabulary[]>([])

  useEffect(() => {
    if (data) {
      setDisciplinesWithVocabulary(spiltVocabularyToDisciplines(data))
    }
  }, [data])

  const handleNavigation = (selectedDiscipline: number): void => {
    navigation.navigate('UserVocabularyExercises', {
      discipline: disciplinesWithVocabulary[selectedDiscipline].discipline,
      disciplineId: 0,
      disciplineTitle: disciplinesWithVocabulary[selectedDiscipline].discipline.title,
      vocabularyItems: disciplinesWithVocabulary[selectedDiscipline].vocabulary,
      closeExerciseAction: CommonActions.goBack(),
    })
  }

  const renderListItem = ({ item }: { item: DisciplineWithVocabulary }): JSX.Element => (
    <DisciplineListItem item={item.discipline} onPress={() => handleNavigation(item.discipline.id)} hasBadge />
  )

  return (
    <RouteWrapper>
      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        <List
          ListHeaderComponent={
            <Title title={getLabels().userVocabulary.myWords} description={wordsDescription(data?.length ?? 0)} />
          }
          data={disciplinesWithVocabulary}
          renderItem={renderListItem}
          showsVerticalScrollIndicator={false}
        />
      </ServerResponseHandler>
    </RouteWrapper>
  )
}

export default DisciplineSelectionScreen
