import { CommonActions, RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import ListItem from '../components/ListItem'
import ServerResponseHandler from '../components/ServerResponseHandler'
import Title from '../components/Title'
import Trophy from '../components/Trophy'
import { EXERCISES, Exercise } from '../constants/data'
import useLoadAsync from '../hooks/useLoadAsync'
import { loadDocuments } from '../hooks/useLoadDocuments'
import { ExerciseParams, ExercisesParams, RoutesParams } from '../navigation/NavigationTypes'
import { wordsDescription } from '../services/helpers'

const Root = styled.View`
  background-color: ${prop => prop.theme.colors.background};
  height: 100%;
  padding: 0 ${props => props.theme.spacings.sm};
`

interface ExercisesScreenProps {
  route: RouteProp<RoutesParams, 'Exercises'>
  navigation: StackNavigationProp<RoutesParams, 'Exercises'>
}

const ExercisesScreen = ({ route, navigation }: ExercisesScreenProps): JSX.Element => {
  const { params } = route
  const { disciplineTitle } = params

  const load = useCallback(async (params: ExercisesParams | ExerciseParams) => {
    if (params.documents) {
      return params.documents
    }
    return loadDocuments(params.discipline)
  }, [])
  const { data: documents, error, loading, refresh } = useLoadAsync(load, params)

  const Header = documents && <Title title={disciplineTitle} description={wordsDescription(documents.length)} />

  const handleNavigation = (item: Exercise): void => {
    if (documents) {
      const closeExerciseAction = CommonActions.navigate('Exercises', { documents, disciplineTitle })
      navigation.navigate(EXERCISES[item.key].nextScreen, {
        documents,
        disciplineTitle,
        closeExerciseAction
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
