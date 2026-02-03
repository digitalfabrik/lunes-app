import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { TrainingImages, TrainingSentences, TrainingSpeech } from '../../../assets/images'
import PressableOpacity from '../../components/PressableOpacity'
import RouteWrapper from '../../components/RouteWrapper'
import Title from '../../components/Title'
import { ContentText } from '../../components/text/Content'
import { HeadingText } from '../../components/text/Heading'
import { StandardJob } from '../../models/Job'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels } from '../../services/helpers'

type TrainingExercise = {
  title: string
  description: string
  image: ReactElement
  navigate?: <T extends keyof RoutesParams>(navigation: StackNavigationProp<RoutesParams, T>, job: StandardJob) => void
}

export const TRAINING_EXERCISES: Record<string, TrainingExercise> = {
  image: {
    title: getLabels().exercises.training.image.title,
    description: getLabels().exercises.training.image.description,
    image: <TrainingImages />,
  },
  speech: {
    title: getLabels().exercises.training.voice.title,
    description: getLabels().exercises.training.voice.description,
    image: <TrainingSpeech />,
  },
  sentence: {
    title: getLabels().exercises.training.sentence.title,
    description: getLabels().exercises.training.sentence.description,
    image: <TrainingSentences />,
  },
}

const ListItem = styled(PressableOpacity)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: ${props => props.theme.spacings.xs};
  background-color: ${props => props.theme.colors.backgroundTeal};
  padding: ${props => props.theme.spacings.sm};
  margin: ${props => props.theme.spacings.xs} ${props => props.theme.spacings.md};
  border-radius: ${props => props.theme.spacings.sm};
`

const ListItemBody = styled.View`
  flex: 1;
`

const Heading = styled(HeadingText)`
  color: black;
`

const Description = styled(ContentText)`
  color: black;
`

export type TrainingExerciseSelectionScreenProps = {
  route: RouteProp<RoutesParams, 'TrainingExerciseSelection'>
  navigation: StackNavigationProp<RoutesParams, 'TrainingExerciseSelection'>
}
const TrainingExerciseSelectionScreen = ({ route, navigation }: TrainingExerciseSelectionScreenProps): ReactElement => {
  const { job } = route.params

  const renderListItem = ({ item }: { item: TrainingExercise }): ReactElement | null => (
    <ListItem
      onPress={() => {
        if (item.navigate !== undefined) {
          item.navigate(navigation, job)
        }
      }}
      disabled={item.navigate === undefined}>
      {item.image}
      <ListItemBody>
        <Heading>{item.title}</Heading>
        <Description>{item.description}</Description>
      </ListItemBody>
    </ListItem>
  )

  return (
    <RouteWrapper>
      <Title title={getLabels().exercises.training.train} subtitle={job.name} />
      <FlatList
        data={Object.values(TRAINING_EXERCISES)}
        renderItem={renderListItem}
        showsVerticalScrollIndicator={false}
      />
    </RouteWrapper>
  )
}

export default TrainingExerciseSelectionScreen
