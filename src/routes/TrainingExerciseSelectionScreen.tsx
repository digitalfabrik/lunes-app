import { RouteProp } from '@react-navigation/native'
import React, { ReactElement } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import ListItem from '../components/ListItem'
import RouteWrapper from '../components/RouteWrapper'
import Title from '../components/Title'
import { RoutesParams } from '../navigation/NavigationTypes'
import { getLabels } from '../services/helpers'

type TrainingExercise = {
  title: string
  description: string
  screen?: string
}

const TRAINING_EXERCISES: Readonly<TrainingExercise[]> = [
  getLabels().exercises.training.images,
  getLabels().exercises.training.voice,
  getLabels().exercises.training.sentence,
]

const Container = styled.View`
  padding: 0 ${props => props.theme.spacings.md};
`

export type TrainingExerciseSelectionScreenProps = {
  route: RouteProp<RoutesParams, 'TrainingExerciseSelection'>
}
const TrainingExerciseSelectionScreen = ({ route }: TrainingExerciseSelectionScreenProps): ReactElement => {
  const { job } = route.params

  const renderListItem = ({ item }: { item: TrainingExercise }): JSX.Element | null => (
    <Container>
      <ListItem
        title={item.title}
        description={item.description}
        onPress={() => {
          // TODO
        }}
      />
    </Container>
  )

  return (
    <RouteWrapper>
      <Title title={getLabels().exercises.training.train} subtitle={job.title} />
      <FlatList data={TRAINING_EXERCISES} renderItem={renderListItem} showsVerticalScrollIndicator={false} />
    </RouteWrapper>
  )
}

export default TrainingExerciseSelectionScreen
