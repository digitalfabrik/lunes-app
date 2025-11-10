import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ComponentType, ReactElement } from 'react'
import { SvgProps } from 'react-native-svg'
import styled from 'styled-components/native'

import { HappySmileyIcon, SadSmileyCircleIcon } from '../../../assets/images'
import Button from '../../components/Button'
import RouteWrapper from '../../components/RouteWrapper'
import { HeadingText } from '../../components/text/Heading'
import { BUTTONS_THEME, SCORE_THRESHOLD_POSITIVE_FEEDBACK } from '../../constants/data'
import theme from '../../constants/theme'
import { Color } from '../../constants/theme/colors'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { calculateTrainingScore, getLabels } from '../../services/helpers'
import ExerciseFinishedBase from '../exercise-finished/components/ExerciseFinishedBase'
import { TRAINING_EXERCISES } from './TrainingExerciseSelectionScreen'

const Container = styled.View`
  padding: 0 ${props => props.theme.spacings.md};
  align-items: center;
`

const QuestionText = styled(HeadingText)`
  padding: ${props => props.theme.spacings.md} 0;
`

type FeedbackDisplay = {
  feedbackColor: Color
  FeedbackIcon: ComponentType<SvgProps>
  message: string
}

const getFeedback = ({ correct, total }: { correct: number; total: number }): FeedbackDisplay => {
  const score = calculateTrainingScore(correct, total)
  if (score > SCORE_THRESHOLD_POSITIVE_FEEDBACK) {
    return {
      feedbackColor: theme.colors.correct,
      FeedbackIcon: HappySmileyIcon,
      message: getLabels().results.feedbackGood,
    }
  }

  return {
    feedbackColor: theme.colors.incorrect,
    FeedbackIcon: SadSmileyCircleIcon,
    message: getLabels().results.feedbackBad,
  }
}

type ExerciseFinishedScreenProps = {
  route: RouteProp<RoutesParams, 'TrainingFinished'>
  navigation: StackNavigationProp<RoutesParams, 'TrainingFinished'>
}

const ExerciseFinishedScreen = ({ navigation, route }: ExerciseFinishedScreenProps): ReactElement => {
  const { results, trainingType, job } = route.params
  const { askContinue, continueNo, continueYes } = getLabels().exercises.training.finished
  const question = askContinue.replace('{}', getLabels().exercises.training[trainingType].title)

  const repeat = TRAINING_EXERCISES[trainingType].navigate

  const { feedbackColor, FeedbackIcon, message } = getFeedback(results)

  return (
    <RouteWrapper
      backgroundColor={theme.colors.background}
      lightStatusBarContent={false}
      shouldSetTopInset
      bottomBackgroundColor={theme.colors.background}>
      <ExerciseFinishedBase
        results={results}
        feedbackColor={feedbackColor}
        unlockedNewExercise={false}
        FeedbackIcon={FeedbackIcon}
        message={message}
        onBack={() => navigation.pop()}>
        <Container>
          <QuestionText>{question}</QuestionText>
          <Button
            onPress={() => {
              navigation.pop()
              if (repeat) {
                repeat(navigation, job)
              }
            }}
            label={continueYes}
            buttonTheme={BUTTONS_THEME.contained}
          />
          <Button onPress={() => navigation.pop()} label={continueNo} buttonTheme={BUTTONS_THEME.outlined} />
        </Container>
      </ExerciseFinishedBase>
    </RouteWrapper>
  )
}

export default ExerciseFinishedScreen
