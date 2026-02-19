import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ComponentType, ReactElement, useState } from 'react'
import { SvgProps } from 'react-native-svg'
import styled from 'styled-components/native'

import {
  BottomTabsIcon,
  HappySmileyIcon,
  LightBulbIconBlack,
  OpenLockIcon,
  PartyHornIcon,
  RepeatIcon,
  SadSmileyCircleIcon,
} from '../../../assets/images'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import RouteWrapper from '../../components/RouteWrapper'
import {
  BUTTONS_THEME,
  EXERCISES,
  FIRST_EXERCISE_FOR_REPETITION,
  SCORE_THRESHOLD_POSITIVE_FEEDBACK,
} from '../../constants/data'
import theme from '../../constants/theme'
import { Color } from '../../constants/theme/colors'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { calculateScore, getLabels } from '../../services/helpers'
import ExerciseFinishedBase from './components/ExerciseFinishedBase'
import ShareSection from './components/ShareSection'

const ContainerText = styled.Text`
  text-align: center;
  text-wrap: wrap;
  margin: -22px ${props => props.theme.spacings.xl} ${props => props.theme.spacings.md}
    ${props => props.theme.spacings.xl};
  color: ${props => props.theme.colors.textSecondary};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  font-size: ${props => props.theme.fonts.defaultFontSize};
`

type ExerciseFinishedScreenProps = {
  route: RouteProp<RoutesParams, 'ExerciseFinished'>
  navigation: StackNavigationProp<RoutesParams, 'ExerciseFinished'>
}

const ExerciseFinishedScreen = ({ navigation, route }: ExerciseFinishedScreenProps): ReactElement => {
  const { exercise, results, unitTitle, closeExerciseAction, unlockedNextExercise } = route.params
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true)
  const correctResults = results.filter(doc => doc.result === 'correct')
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

  const navigateToNextUnit = (): void => navigation.pop(2)

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
        message: getLabels().results.finishedUnit,
        resultColor: theme.colors.correct,
        buttonText: getLabels().results.action.back,
        navigationAction: navigateToNextUnit,
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
      bottomBackgroundColor={theme.colors.background}
    >
      {exercise === FIRST_EXERCISE_FOR_REPETITION &&
        results.some(result => result.numberOfTries > 1) && (
        <Modal
          visible={isModalVisible}
          confirmationAction={() => {
            setIsModalVisible(false)
            navigation.navigate('BottomTabNavigator', { screen: 'RepetitionTab' })
          }}
          cancelButtonText={getLabels().repetition.repeatLater}
          confirmationButtonText={getLabels().repetition.repeatNow}
          onClose={() => setIsModalVisible(false)}
          testID='repetition-modal'
          icon={<LightBulbIconBlack width={theme.spacingsPlain.xxl} height={theme.spacingsPlain.xxl} />}
          text={getLabels().repetition.hintModalHeaderText}
        >
          <ContainerText>{getLabels().repetition.hintModalContentText}</ContainerText>
          <BottomTabsIcon style={{ marginBottom: 40 }} />
        </Modal>
      )}
      <ExerciseFinishedBase
        results={{ correct: correctResults.length, total: results.length }}
        feedbackColor={resultColor}
        unlockedNewExercise={unlockedNextExercise}
        FeedbackIcon={ResultIcon}
        message={message}
        onBack={() => navigation.dispatch(closeExerciseAction)}
      >
        <Button
          label={buttonText}
          iconLeft={buttonText === getLabels().results.action.repeat ? RepeatIcon : undefined}
          buttonTheme={BUTTONS_THEME.contained}
          onPress={() => navigationAction()}
        />
        <ShareSection unitTitle={unitTitle} results={results} />
      </ExerciseFinishedBase>
    </RouteWrapper>
  )
}

export default ExerciseFinishedScreen
