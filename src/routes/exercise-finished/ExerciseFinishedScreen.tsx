import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ComponentType, ReactElement, useState } from 'react'
import * as Progress from 'react-native-progress'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { SvgProps } from 'react-native-svg'
import styled from 'styled-components/native'

import {
  BottomTabsIcon,
  CloseIconWhite,
  LightBulbIconBlack,
  PartyHornIcon,
  SadSmileyCircleIcon,
} from '../../../assets/images'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import PressableOpacity from '../../components/PressableOpacity'
import RoundedBackground from '../../components/RoundedBackground'
import RouteWrapper from '../../components/RouteWrapper'
import { Content } from '../../components/text/Content'
import { HeadingBackground } from '../../components/text/Heading'
import {
  BUTTONS_THEME,
  EXERCISES,
  FIRST_EXERCISE_FOR_REPETITION,
  SCORE_THRESHOLD_POSITIVE_FEEDBACK,
} from '../../constants/data'
import theme from '../../constants/theme'
import { Color } from '../../constants/theme/colors'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { calculateScore, getLabels, wordsDescription } from '../../services/helpers'
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

const Message = styled(HeadingBackground)`
  color: ${prop => prop.theme.colors.background};
  text-align: center;
`

const Icon = styled(PressableOpacity)`
  position: absolute;
  top: 8px;
  right: 100px;
`

const Results = styled(Content)<{ color: Color }>`
  color: ${props => props.color};
  padding: ${props => props.theme.spacings.md} 0 ${props => props.theme.spacings.xs};
`

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
  const { exercise, results, unitTitle, closeExerciseAction } = route.params
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true)
  const correctResults = results.filter(doc => doc.result === 'correct')
  const percentageOfCorrectResults = correctResults.length / results.length
  const score = calculateScore(results)

  const { exercise: notNeededForNavigation1, results: notNeededForNavigation2, ...navigationParams } = route.params
  const repeatExercise = (): void => navigation.navigate(EXERCISES[exercise].screen, { ...navigationParams })

  const wasSuccessful = score > SCORE_THRESHOLD_POSITIVE_FEEDBACK
  const isRepetition = route.params.contentType === 'repetition'

  const navigateBackToMenu = (): void => navigation.pop(2)

  const helper = (): {
    message: string
    resultColor: Color
    buttonText: string
    ResultIcon: ComponentType<SvgProps>
    navigationAction: () => void
  } => {
    if (wasSuccessful) {
      return {
        message: getLabels().results.finishedUnit,
        resultColor: theme.colors.correct,
        buttonText: getLabels().results.action.back,
        navigationAction: navigateBackToMenu,
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
      backgroundColor={theme.colors.primary}
      lightStatusBarContent={!wasSuccessful}
      bottomBackgroundColor={theme.colors.background}>
      {exercise === FIRST_EXERCISE_FOR_REPETITION && !isRepetition && (
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
          text={getLabels().repetition.hintModalHeaderText}>
          <ContainerText>{getLabels().repetition.hintModalContentText}</ContainerText>
          <BottomTabsIcon style={{ marginBottom: 40 }} />
        </Modal>
      )}
      <Root>
        <RoundedBackground color={theme.colors.primary}>
          <Icon onPress={() => navigation.dispatch(closeExerciseAction)}>
            <CloseIconWhite width={hp('3%')} height={hp('3%')} />
          </Icon>
          <ResultIcon width={hp('5%')} height={hp('5%')} />
          <MessageContainer>
            <Message>{message}</Message>
            <Results color={resultColor}>
              {correctResults.length} {getLabels().results.of} {wordsDescription(results.length)}{' '}
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

        <Button label={buttonText} buttonTheme={BUTTONS_THEME.contained} onPress={() => navigationAction()} />
        <ShareSection unitTitle={unitTitle} results={results} />
      </Root>
    </RouteWrapper>
  )
}

export default ExerciseFinishedScreen
