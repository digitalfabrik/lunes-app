import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { UnitListItem } from '../../components/DisciplineListItem'
import RouteWrapper from '../../components/RouteWrapper'
import Title from '../../components/Title'
import useStorage from '../../hooks/useStorage'
import { UserVocabularyUnitId } from '../../models/Unit'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels, wordsDescription } from '../../services/helpers'
import { splitVocabularyIntoUnits, UnitWithVocabulary } from './splitVocabularyToUnits'

const List = styled.FlatList`
  margin: 0 ${props => props.theme.spacings.md};
  height: 100%;
` as unknown as typeof FlatList

type UnitSelectionScreenProps = {
  navigation: StackNavigationProp<RoutesParams, 'UserVocabularyUnitSelection'>
}

const UnitSelectionScreen = ({ navigation }: UnitSelectionScreenProps): ReactElement => {
  const [userVocabulary] = useStorage('userVocabulary')
  const unitsWithVocabulary = splitVocabularyIntoUnits(userVocabulary)

  const handleNavigation = (selectedUnit: UserVocabularyUnitId): void => {
    const selectedUnitWithVocabulary = unitsWithVocabulary[selectedUnit.index]
    return navigation.navigate('SpecialExercises', {
      unit: selectedUnitWithVocabulary.unit,
      jobTitle: selectedUnitWithVocabulary.unit.title,
      vocabularyItems: selectedUnitWithVocabulary.vocabulary,
    })
  }

  const renderListItem = ({ item }: { item: UnitWithVocabulary }): ReactElement => (
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
