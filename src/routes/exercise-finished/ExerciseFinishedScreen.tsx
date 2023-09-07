import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, ComponentType } from 'react'
import * as Progress from 'react-native-progress'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { SvgProps } from 'react-native-svg'
import styled from 'styled-components/native'

import {
  CloseIcon,
  CloseIconWhite,
  HappySmileyIcon,
  OpenLockIcon,
  PartyHornIcon,
  RepeatIcon,
  SadSmileyCircleIcon,
} from '../../../assets/images'
import Button from '../../components/Button'
import PressableOpacity from '../../components/PressableOpacity'
import RoundedBackground from '../../components/RoundedBackground'
import RouteWrapper from '../../components/RouteWrapper'
import { Content } from '../../components/text/Content'
import { HeadingBackground } from '../../components/text/Heading'
import { BUTTONS_THEME, EXERCISES, SCORE_THRESHOLD_POSITIVE_FEEDBACK } from '../../constants/data'
import theme from '../../constants/theme'
import { Color } from '../../constants/theme/colors'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { calculateScore, getLabels } from '../../services/helpers'
import ShareSection from './components/ShareSection'

const Root = styled.View`
  background-color: ${prop => prop.theme.colors.background};
  height: 100%;
  align-items: center;
`
const MessageContainer = styled.View`
  width: 60%;
  margin-top: ${props => props.theme.spacings.sm};
  align-items: center;
`
const Message = styled(HeadingBackground)<{ unlockedNextExercise: boolean }>`
  color: ${prop => (prop.unlockedNextExercise ? prop.theme.colors.primary : prop.theme.colors.background)};
  text-align: center;
`
const Icon = styled(PressableOpacity)`
  position: absolute;
  top: 25px;
  right: 100px;
`

const Results = styled(Content)<{ color: Color }>`
  color: ${props => props.color};
  padding: ${props => props.theme.spacings.md} 0 ${props => props.theme.spacings.xs};
`

type ExerciseFinishedScreenProps = {
  route: RouteProp<RoutesParams, 'ExerciseFinished'>
  navigation: StackNavigationProp<RoutesParams, 'ExerciseFinished'>
}

const ExerciseFinishedScreen = ({ navigation, route }: ExerciseFinishedScreenProps): ReactElement => {
  const { exercise, results, disciplineTitle, closeExerciseAction, unlockedNextExercise } = route.params
  const correctResults = results.filter(doc => doc.result === 'correct')
  const percentageOfCorrectResults = correctResults.length / results.length
  const score = calculateScore(results)

  const {
    exercise: notNeededForNavigation1,
    results: notNeededForNavigation2,
    unlockedNextExercise: notNeededForNavigation3,
    ...navigationParams
  } = route.params
  const repeatExercise = (): void => navigation.navigate(EXERCISES[exercise].screen, { ...navigationParams })

  const startNextExercise = (): void => {
    if (exercise + 1 < EXERCISES.length) {
      navigation.navigate(EXERCISES[exercise + 1].screen, { ...navigationParams })
    }
  }

  const navigateToNextDiscipline = (): void => navigation.pop(2)

  const helper = (): {
    message: string
    resultColor: Color
    buttonText: string
    ResultIcon: ComponentType<SvgProps>
    navigationAction: () => void
  } => {
    const isLastExercise = exercise === EXERCISES.length - 1
    if (unlockedNextExercise && !isLastExercise) {
      return {
        message: `${getLabels().results.unlockExercise.part1}, ${EXERCISES[exercise + 1].title} ${
          getLabels().results.unlockExercise.part2
        }`,
        resultColor: theme.colors.primary,
        buttonText: getLabels().results.action.nextExercise,
        navigationAction: startNextExercise,
        ResultIcon: OpenLockIcon,
      }
    }
    if (score > SCORE_THRESHOLD_POSITIVE_FEEDBACK) {
      if (!isLastExercise) {
        return {
          message: getLabels().results.feedbackGood,
          resultColor: theme.colors.correct,
          buttonText: getLabels().results.action.continue,
          navigationAction: startNextExercise,
          ResultIcon: HappySmileyIcon,
        }
      }
      return {
        message: getLabels().results.finishedDiscipline,
        resultColor: theme.colors.correct,
        buttonText: getLabels().results.action.disciplineOverview,
        navigationAction: navigateToNextDiscipline,
        ResultIcon: PartyHornIcon,
      }
    }
    return {
      message: getLabels().results.feedbackBad,
      resultColor: theme.colors.incorrect,
      buttonText: getLabels().results.action.repeat,
      navigationAction: repeatExercise,
      ResultIcon: SadSmileyCircleIcon,
    }
  }

  const { message, resultColor, buttonText, ResultIcon, navigationAction } = helper()

  return (
    <RouteWrapper
      backgroundColor={unlockedNextExercise ? theme.colors.correct : theme.colors.primary}
      lightStatusBarContent={!unlockedNextExercise}
      bottomBackgroundColor={theme.colors.background}>
      <Root>
        <RoundedBackground color={unlockedNextExercise ? theme.colors.correct : theme.colors.primary}>
          <Icon onPress={() => navigation.dispatch(closeExerciseAction)}>
            {unlockedNextExercise ? (
              <CloseIcon width={hp('3%')} height={hp('3%')} />
            ) : (
              <CloseIconWhite width={hp('3%')} height={hp('3%')} />
            )}
          </Icon>
          <ResultIcon width={hp('5%')} height={hp('5%')} />
          <MessageContainer>
            <Message unlockedNextExercise={unlockedNextExercise}>{message}</Message>
            <Results color={resultColor}>
              {correctResults.length} {getLabels().results.of} {results.length} {getLabels().general.words}{' '}
              {getLabels().results.correct}
            </Results>
            <Progress.Bar
              color={resultColor}
              progress={percentageOfCorrectResults}
              unfilledColor={theme.colors.background}
              width={hp('22%')}
              height={hp('1.1%')}
              borderWidth={0}
            />
          </MessageContainer>
        </RoundedBackground>

        <Button
          label={buttonText}
          iconLeft={buttonText === getLabels().results.action.repeat ? RepeatIcon : undefined}
          buttonTheme={BUTTONS_THEME.contained}
          onPress={() => navigationAction()}
        />
        <ShareSection disciplineTitle={disciplineTitle} results={results} />
      </Root>
    </RouteWrapper>
  )
}

export default ExerciseFinishedScreen
