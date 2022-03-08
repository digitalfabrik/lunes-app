import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { FlatList, Alert } from 'react-native'
import styled from 'styled-components/native'

import ListItem from '../components/ListItem'
import ServerResponseHandler from '../components/ServerResponseHandler'
import Title from '../components/Title'
import Trophy from '../components/Trophy'
import { EXERCISES, Exercise } from '../constants/data'
import labels from '../constants/labels.json'
import useLoadDocuments from '../hooks/useLoadDocuments'
import { RoutesParams } from '../navigation/NavigationTypes'
import { childrenDescription } from '../services/helpers'
import { MIN_WORDS } from './choice-exercises/WordChoiceExerciseScreen'

const Root = styled.View`
  background-color: ${prop => prop.theme.colors.background};
  height: 100%;
`

interface ExercisesScreenProps {
  route: RouteProp<RoutesParams, 'Exercises'>
  navigation: StackNavigationProp<RoutesParams, 'Exercises'>
}

const ExercisesScreen = ({ route, navigation }: ExercisesScreenProps): JSX.Element => {
  const { discipline } = route.params
  const { title, numberOfChildren } = discipline

  const { data: documents, error, loading, refresh } = useLoadDocuments(discipline, true)

  const Header = <Title title={title} description={childrenDescription(discipline)} />

  const handleNavigation = (item: Exercise): void => {
    if (!documents) {
      return
    }
    if (item.title === labels.exercises.wordChoice.title && numberOfChildren < MIN_WORDS) {
      Alert.alert(labels.exercises.wordChoice.errorWrongModuleSize)
    } else {
      navigation.navigate(EXERCISES[item.key].nextScreen, {
        documents,
        discipline
      })
    }
  }

  const Item = ({ item }: { item: Exercise }): JSX.Element | null => (
    <ListItem title={item.title} description={item.description} onPress={() => handleNavigation(item)}>
      <Trophy level={item.level} />
    </ListItem>
  )

  return (
    <Root>
      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        {documents && (
          <FlatList
            data={EXERCISES}
            ListHeaderComponent={Header}
            renderItem={Item}
            keyExtractor={({ key }) => key.toString()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ServerResponseHandler>
    </Root>
  )
}

export default ExercisesScreen
