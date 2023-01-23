import { CommonActions, RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import ListItem from '../../components/ListItem'
import RouteWrapper from '../../components/RouteWrapper'
import Title from '../../components/Title'
import { Exercise, EXERCISES } from '../../constants/data'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { wordsDescription } from '../../services/helpers'

const Container = styled.View`
  padding: 0 ${props => props.theme.spacings.md};
`

type ExercisesScreenProps = {
  route: RouteProp<RoutesParams, 'UserVocabularyExercises'>
  navigation: StackNavigationProp<RoutesParams, 'UserVocabularyExercises'>
}

const ExercisesScreen = ({ route, navigation }: ExercisesScreenProps): JSX.Element => {
  const { disciplineTitle, disciplineId, vocabularyItems } = route.params

  const handleNavigation = (item: Exercise): void => {
    if (vocabularyItems) {
      const closeExerciseAction = CommonActions.navigate('UserVocabularyExercises', {
        vocabularyItems,
        disciplineTitle,
        disciplineId,
      })
      navigation.navigate(EXERCISES[item.key].screen, {
        vocabularyItems,
        disciplineId: 0,
        disciplineTitle,
        closeExerciseAction,
      })
    }
  }

  const renderListItem = ({ item }: { item: Exercise }): JSX.Element | null => (
    <Container>
      <ListItem title={item.title} description={item.description} onPress={() => handleNavigation(item)} />
    </Container>
  )

  return (
    <RouteWrapper>
      <Title title={disciplineTitle} description={wordsDescription(vocabularyItems ? vocabularyItems.length : 0)} />
      <FlatList
        data={EXERCISES}
        renderItem={renderListItem}
        keyExtractor={({ key }) => key.toString()}
        showsVerticalScrollIndicator={false}
      />
    </RouteWrapper>
  )
}

export default ExercisesScreen
