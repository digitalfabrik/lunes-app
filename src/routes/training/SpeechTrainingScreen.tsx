import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import Button from '../../components/Button'
import RouteWrapper from '../../components/RouteWrapper'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import { ContentText } from '../../components/text/Content'
import { BUTTONS_THEME } from '../../constants/data'
import useLoadWordsByJob from '../../hooks/useLoadWordsByJob'
import { StandardJob } from '../../models/Job'
import VocabularyItem from '../../models/VocabularyItem'
import { Route, RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels } from '../../services/helpers'
import TrainingExerciseContainer from './components/TrainingExerciseContainer'
import TrainingExerciseHeader from './components/TrainingExerciseHeader'

type SpeechTrainingProps = {
  job: StandardJob
  vocabularyItems: VocabularyItem[]
  navigation: StackNavigationProp<RoutesParams, Route>
}

const SpeechTraining = ({ vocabularyItems, navigation, job }: SpeechTrainingProps): ReactElement | null => {
  return (
    <>
      <TrainingExerciseHeader currentWord={0} numberOfWords={1} navigation={navigation} />

      <TrainingExerciseContainer
        title={getLabels().exercises.training.speech.sayWord}
        footer={<Button onPress={() => {}} buttonTheme={BUTTONS_THEME.outlined} label={getLabels().exercises.skip} />}>
        <ContentText>TOOD</ContentText>
      </TrainingExerciseContainer>
    </>
  )
}

export type SpeechTrainingScreenProps = {
  route: RouteProp<RoutesParams, 'SpeechTraining'>
  navigation: StackNavigationProp<RoutesParams, 'SpeechTraining'>
}

const ImageTrainingScreen = ({ route, navigation }: SpeechTrainingScreenProps): ReactElement => {
  const { job } = route.params
  const { data: vocabularyItems, error, loading, refresh } = useLoadWordsByJob(job.id)

  return (
    <RouteWrapper>
      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        {vocabularyItems && <SpeechTraining vocabularyItems={vocabularyItems} navigation={navigation} job={job} />}
      </ServerResponseHandler>
    </RouteWrapper>
  )
}

export default ImageTrainingScreen
