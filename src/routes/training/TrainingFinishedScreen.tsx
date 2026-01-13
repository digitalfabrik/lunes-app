import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { HappySmileyIcon } from '../../../assets/images'
import Button from '../../components/Button'
import RouteWrapper from '../../components/RouteWrapper'
import { HeadingText } from '../../components/text/Heading'
import { BUTTONS_THEME } from '../../constants/data'
import theme from '../../constants/theme'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels } from '../../services/helpers'
import ExerciseFinishedBase from '../exercise-finished/components/ExerciseFinishedBase'
import { TRAINING_EXERCISES } from './TrainingExerciseSelectionScreen'

const Container = styled.View`
  padding: 0 ${props => props.theme.spacings.md};
  align-items: center;
`

const QuestionText = styled(HeadingText)`
  padding: ${props => props.theme.spacings.md} 0;
`

type ExerciseFinishedScreenProps = {
  route: RouteProp<RoutesParams, 'TrainingFinished'>
  navigation: StackNavigationProp<RoutesParams, 'TrainingFinished'>
}

const ExerciseFinishedScreen = ({ navigation, route }: ExerciseFinishedScreenProps): ReactElement => {
  const { results, trainingType, job } = route.params
  const { askContinue, continueNo, continueYes } = getLabels().exercises.training.finished
  const question = askContinue.replace('{}', getLabels().exercises.training[trainingType].title)

  const repeat = TRAINING_EXERCISES[trainingType].navigate

  return (
    <RouteWrapper
      backgroundColor={theme.colors.background}
      lightStatusBarContent={false}
      shouldSetTopInset
      bottomBackgroundColor={theme.colors.background}>
      <ExerciseFinishedBase
        results={results}
        feedbackColor={theme.colors.correct}
        unlockedNewExercise={false}
        FeedbackIcon={HappySmileyIcon}
        message={getLabels().exercises.feedback.positive}
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
