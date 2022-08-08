import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import * as Progress from 'react-native-progress'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { SvgProps } from 'react-native-svg'
import styled from 'styled-components/native'

import {
  CloseIcon,
  CloseIconWhite,
  HappySmileyIcon,
  OpenLockIcon,
  PartyHornIcon,
  RepeatIcon,
  SadSmileyIcon,
} from '../../../assets/images'
import Button from '../../components/Button'
import RoundedBackground from '../../components/RoundedBackground'
import RouteWrapper from '../../components/RouteWrapper'
import { Content } from '../../components/text/Content'
import { HeadingBackground } from '../../components/text/Heading'
import { BUTTONS_THEME, EXERCISES } from '../../constants/data'
import labels from '../../constants/labels.json'
import theme from '../../constants/theme'
import { Color } from '../../constants/theme/colors'
import { RoutesParams } from '../../navigation/NavigationTypes'
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
const Icon = styled.TouchableOpacity`
  position: absolute;
  top: 25px;
  right: 100px;
`

const Results = styled(Content)<{ color: Color }>`
  color: ${props => props.color};
  padding: ${props => props.theme.spacings.md} 0 ${props => props.theme.spacings.xs};
`

interface Props {
  route: RouteProp<RoutesParams, 'ExerciseFinished'>
  navigation: StackNavigationProp<RoutesParams, 'ExerciseFinished'>
}

const ExerciseFinishedScreen = ({ navigation, route }: Props): ReactElement => {
  const { exercise, results, disciplineTitle, disciplineId, documents, closeExerciseAction, unlockedNextExercise } =
    route.params
  const correctResults = results.filter(doc => doc.result === 'correct')
  const percentageOfCorrectResults = correctResults.length / results.length

  const repeatExercise = (): void =>
    navigation.navigate(EXERCISES[exercise].screen, {
      documents,
      disciplineId,
      disciplineTitle,
      closeExerciseAction,
    })

  const startNextExercise = (): void => {
    if (exercise + 1 < EXERCISES.length) {
      navigation.navigate(EXERCISES[exercise + 1].screen, {
        documents,
        disciplineId,
        disciplineTitle,
        closeExerciseAction,
      })
    }
  }

  const navigateToNextModule = (): void => navigation.pop(2)

  const helper = (): {
    message: string
    resultColor: Color
    buttonText: string
    ResultIcon: React.ComponentType<SvgProps>
    navigationAction: () => void
  } => {
    const isLastExercise = exercise === EXERCISES.length - 1
    if (unlockedNextExercise && !isLastExercise) {
      return {
        message: `${labels.results.unlockExercise.part1}, ${EXERCISES[exercise + 1].title} ${
          labels.results.unlockExercise.part2
        }`,
        resultColor: theme.colors.primary,
        buttonText: labels.results.action.nextExercise,
        navigationAction: startNextExercise,
        ResultIcon: OpenLockIcon,
      }
    }
    if (percentageOfCorrectResults > 1 / 3) {
      if (!isLastExercise) {
        return {
          message: labels.results.feedbackGood,
          resultColor: theme.colors.correct,
          buttonText: labels.results.action.continue,
          navigationAction: startNextExercise,
          ResultIcon: HappySmileyIcon,
        }
      }
      return {
        message: labels.results.finishedModule,
        resultColor: theme.colors.correct,
        buttonText: labels.results.action.close,
        navigationAction: navigateToNextModule,
        ResultIcon: PartyHornIcon,
      }
    }
    return {
      message: labels.results.feedbackBad,
      resultColor: theme.colors.incorrect,
      buttonText: labels.results.action.repeat,
      navigationAction: repeatExercise,
      ResultIcon: SadSmileyIcon,
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
              <CloseIcon width={wp('6%')} height={wp('6%')} />
            ) : (
              <CloseIconWhite width={wp('6%')} height={wp('6%')} />
            )}
          </Icon>
          <ResultIcon width={wp('10%')} height={wp('10%')} />
          <MessageContainer>
            <Message unlockedNextExercise={unlockedNextExercise}>{message}</Message>
            <Results color={resultColor}>
              {correctResults.length} {labels.results.of} {results.length} {labels.general.words}{' '}
              {labels.results.correct}
            </Results>
            <Progress.Bar
              color={resultColor}
              progress={percentageOfCorrectResults}
              unfilledColor={theme.colors.background}
              width={wp('40%')}
              height={wp('2%')}
              borderWidth={0}
            />
          </MessageContainer>
        </RoundedBackground>

        <Button
          label={buttonText}
          iconLeft={buttonText === labels.results.action.repeat ? RepeatIcon : undefined}
          buttonTheme={BUTTONS_THEME.contained}
          onPress={() => navigationAction()}
        />
        <ShareSection disciplineTitle={disciplineTitle} results={results} />
      </Root>
    </RouteWrapper>
  )
}

export default ExerciseFinishedScreen
