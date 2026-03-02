import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { FlatList } from 'react-native'
import styled, { css } from 'styled-components/native'

import { TrainingImages, TrainingSentences, TrainingSpeech } from '../../../assets/images'
import PressableOpacity from '../../components/PressableOpacity'
import RouteWrapper from '../../components/RouteWrapper'
import ServerResponseHandler from '../../components/ServerResponseHandler.tsx'
import Title from '../../components/Title'
import { ContentText } from '../../components/text/Content'
import { HeadingText } from '../../components/text/Heading'
import useLoadWordsByJob from '../../hooks/useLoadWordsByJob.ts'
import { StandardJob } from '../../models/Job'
import VocabularyItem from '../../models/VocabularyItem.ts'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels } from '../../services/helpers'

type TrainingExercise = {
  title: string
  description: string
  image: ReactElement
  hasContent?: (items: VocabularyItem[]) => boolean
  navigate?: <T extends keyof RoutesParams>(navigation: StackNavigationProp<RoutesParams, T>, job: StandardJob) => void
}

export const TRAINING_EXERCISES: Record<string, TrainingExercise> = {
  image: {
    title: getLabels().exercises.training.image.title,
    description: getLabels().exercises.training.image.description,
    image: <TrainingImages />,
    navigate: (navigation, job) => navigation.navigate('ImageTraining', { job }),
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
    hasContent: items => items.some(item => item.exampleSentence !== undefined),
    navigate: (navigation, job) => navigation.navigate('SentenceTraining', { job }),
  },
}

const Root = styled.View`
  padding: 0 ${props => props.theme.spacings.sm};
`

const ListItemWrapper = styled.View`
  margin: ${props => props.theme.spacings.xs};
`

const ListItem = styled(PressableOpacity)<{ disabled: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: ${props => props.theme.spacings.xs};
  ${props =>
    props.disabled &&
    css`
      opacity: 0.5;
    `}
  background-color: ${props => props.theme.colors.backgroundTeal};
  padding: ${props => props.theme.spacings.sm};
  border-radius: ${props => props.theme.spacings.sm};
`

const ComingSoonBadge = styled.View`
  position: absolute;
  top: -${props => props.theme.spacings.xs};
  right: -${props => props.theme.spacings.xs};
  background-color: ${props => props.theme.colors.backgroundPopup};
  border-radius: ${props => props.theme.spacings.xs};
  padding: ${props => props.theme.spacings.xxs} ${props => props.theme.spacings.xs};
  z-index: 1;
`

const ComingSoonText = styled(ContentText)`
  color: white;
  font-weight: bold;
  font-size: ${props => props.theme.fonts.smallFontSize};
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

  const { data: vocabularyItems, error, loading, refresh } = useLoadWordsByJob(job.id)

  const renderListItem = ({ item }: { item: TrainingExercise }): ReactElement | null => {
    const isDisabled =
      item.navigate === undefined ||
      vocabularyItems?.length === 0 ||
      (vocabularyItems !== null && item.hasContent !== undefined && !item.hasContent(vocabularyItems))
    return (
      <ListItemWrapper>
        {isDisabled && (
          <ComingSoonBadge>
            <ComingSoonText>{getLabels().exercises.training.comingSoon}</ComingSoonText>
          </ComingSoonBadge>
        )}
        <ListItem
          onPress={() => {
            if (item.navigate !== undefined) {
              item.navigate(navigation, job)
            }
          }}
          disabled={isDisabled}
        >
          {item.image}
          <ListItemBody>
            <Heading>{item.title}</Heading>
            <Description>{item.description}</Description>
          </ListItemBody>
        </ListItem>
      </ListItemWrapper>
    )
  }

  return (
    <RouteWrapper>
      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        <Root>
          <Title title={getLabels().exercises.training.train} subtitle={job.name} />
          <FlatList
            data={Object.values(TRAINING_EXERCISES)}
            renderItem={renderListItem}
            showsVerticalScrollIndicator={false}
          />
        </Root>
      </ServerResponseHandler>
    </RouteWrapper>
  )
}

export default TrainingExerciseSelectionScreen
