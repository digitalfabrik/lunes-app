import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { UnitListItem } from '../../components/DisciplineListItem'
import RouteWrapper from '../../components/RouteWrapper'
import Title from '../../components/Title'
import { VocabularyItem } from '../../constants/endpoints'
import useReadUserVocabulary from '../../hooks/useReadUserVocabulary'
import { UserVocabularyUnit, UserVocabularyUnitId } from '../../models/Unit'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels, wordsDescription } from '../../services/helpers'
import { splitVocabularyIntoDisciplines } from './splitVocabularyToUnits'

const List = styled.FlatList`
  margin: 0 ${props => props.theme.spacings.md};
  height: 100%;
` as unknown as typeof FlatList

type UnitSelectionScreenProps = {
  navigation: StackNavigationProp<RoutesParams, 'UserVocabularyUnitSelection'>
}

export type UnitWithVocabulary = {
  unit: UserVocabularyUnit
  vocabulary: VocabularyItem[]
}

const UnitSelectionScreen = ({ navigation }: UnitSelectionScreenProps): JSX.Element => {
  const userVocabulary = useReadUserVocabulary()
  const unitsWithVocabulary = splitVocabularyIntoDisciplines(userVocabulary)

  const handleNavigation = (selectedUnit: UserVocabularyUnitId): void => {
    const selectedUnitWithVocabulary = unitsWithVocabulary[selectedUnit.id]
    return navigation.navigate('SpecialExercises', {
      unit: selectedUnitWithVocabulary.unit,
      jobTitle: selectedUnitWithVocabulary.unit.title,
      vocabularyItems: selectedUnitWithVocabulary.vocabulary,
    })
  }

  const renderListItem = ({ item }: { item: UnitWithVocabulary }): JSX.Element => (
    <UnitListItem unit={item.unit} onPress={() => handleNavigation(item.unit.id)} />
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
        data={unitsWithVocabulary}
        renderItem={renderListItem}
        showsVerticalScrollIndicator={false}
      />
    </RouteWrapper>
  )
}

export default UnitSelectionScreen
