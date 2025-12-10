import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import ListItem from '../../components/ListItem'
import RouteWrapper from '../../components/RouteWrapper'
import Title from '../../components/Title'
import { StandardJob } from '../../models/Job'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels } from '../../services/helpers'

type TrainingExercise = {
  title: string
  description: string
  navigate?: (navigation: StackNavigationProp<RoutesParams, 'TrainingExerciseSelection'>, job: StandardJob) => void
}

const TRAINING_EXERCISES: Readonly<TrainingExercise[]> = [
  {
    title: getLabels().exercises.training.images.title,
    description: getLabels().exercises.training.images.description,
    navigate: (navigation, job) => navigation.navigate('ImageTraining', { job }),
  },
  getLabels().exercises.training.voice,
  {
    title: getLabels().exercises.training.sentence.title,
    description: getLabels().exercises.training.sentence.description,
    navigate: (navigation, job) => navigation.navigate('SentenceTraining', { job }),
  },
]

const Container = styled.View`
  padding: 0 ${props => props.theme.spacings.md};
`

export type TrainingExerciseSelectionScreenProps = {
  route: RouteProp<RoutesParams, 'TrainingExerciseSelection'>
  navigation: StackNavigationProp<RoutesParams, 'TrainingExerciseSelection'>
}
const TrainingExerciseSelectionScreen = ({ route, navigation }: TrainingExerciseSelectionScreenProps): ReactElement => {
  const { job } = route.params

  const renderListItem = ({ item }: { item: TrainingExercise }): ReactElement | null => (
    <Container>
      <ListItem
        title={item.title}
        description={item.description}
        onPress={() => {
          if (item.navigate !== undefined) {
            item.navigate(navigation, job)
          }
        }}
        disabled={item.navigate === undefined}
      />
    </Container>
  )

  return (
    <RouteWrapper>
      <Title title={getLabels().exercises.training.train} subtitle={job.name} />
      <FlatList data={TRAINING_EXERCISES} renderItem={renderListItem} showsVerticalScrollIndicator={false} />
    </RouteWrapper>
  )
}

export default TrainingExerciseSelectionScreen
