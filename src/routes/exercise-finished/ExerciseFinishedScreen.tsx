import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useState } from 'react'
import { SafeAreaView } from 'react-native'
import * as Progress from 'react-native-progress'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import {
  CloseIcon,
  CloseIconWhite,
  HappSmileyIcon,
  OpenLockIcon,
  PartyHornIcon,
  RepeatIcon,
  SadSmileyIcon
} from '../../../assets/images'
import Button from '../../components/Button'
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
const UpperSection = styled.View<{ unlockedNextExercise: boolean }>`
  width: 140%;
  height: 50%;
  background-color: ${prop => (prop.unlockedNextExercise ? prop.theme.colors.correct : prop.theme.colors.primary)};
  border-bottom-left-radius: ${hp('60%')}px;
  border-bottom-right-radius: ${hp('60%')}px;
  margin-bottom: ${props => props.theme.spacings.xxl};
  justify-content: center;
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

  const [message, setMessage] = useState<string>('')
  const [resultColor, setResultColor] = useState<Color>(theme.colors.background)
  const [buttonText, setButtonText] = useState<string>('')
  const [navigationAction, setNavigationAction] = useState<() => void>(() => undefined)
  const [icon, setIcon] = useState<SVGElement | null>(null)

  const repeatExercise = (): void =>
    navigation.navigate(EXERCISES[exercise].screen, {
      documents,
      disciplineId,
      disciplineTitle,
      closeExerciseAction
    })

  const startNextExercise = (): void => {
    if (exercise + 1 < EXERCISES.length) {
      navigation.navigate(EXERCISES[exercise + 1].screen, {
        documents,
        disciplineId,
        disciplineTitle,
        closeExerciseAction
      })
    }
  }

  const navigateToNextModule = (): void => {
    navigation.pop(2)
  }

  React.useEffect(() => {
    const isLastExercise = exercise === EXERCISES.length - 1
    const iconSize = wp('10%')
    if (unlockedNextExercise && !isLastExercise) {
      setMessage(
        `${labels.results.unlockExercise.part1} ${EXERCISES[exercise + 1].title} ${labels.results.unlockExercise.part2}`
      )
      setResultColor(theme.colors.primary)
      setButtonText(labels.results.button.nextExercise)
      setNavigationAction(() => () => startNextExercise())
      setIcon(<OpenLockIcon width={iconSize} height={iconSize} />)
    } else if (percentageOfCorrectResults > 1 / 3) {
      setResultColor(theme.colors.correct)
      if (!isLastExercise) {
        setMessage(labels.results.feedbackGood)
        setButtonText(labels.results.button.continue)
        setNavigationAction(() => () => startNextExercise())
        setIcon(<HappSmileyIcon width={iconSize} height={iconSize} />)
      } else {
        setMessage(labels.results.finishedModule)
        setButtonText(labels.results.button.close)
        setNavigationAction(() => () => navigateToNextModule())
        setIcon(<PartyHornIcon width={iconSize} height={iconSize} />)
      }
    } else {
      setMessage(labels.results.feedbackBad)
      setResultColor(theme.colors.incorrect)
      setButtonText(labels.results.button.repeat)
      setNavigationAction(() => () => repeatExercise())
      setIcon(<SadSmileyIcon width={iconSize} height={iconSize} />)
    }
  }, [results])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Root>
        <UpperSection unlockedNextExercise={unlockedNextExercise}>
          <Icon onPress={() => navigation.dispatch(closeExerciseAction)}>
            {unlockedNextExercise ? (
              <CloseIcon width={wp('6%')} height={wp('6%')} />
            ) : (
              <CloseIconWhite width={wp('6%')} height={wp('6%')} />
            )}
          </Icon>
          {icon}
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
        </UpperSection>

        <Button
          label={buttonText}
          iconLeft={buttonText === labels.results.button.repeat ? RepeatIcon : undefined}
          buttonTheme={BUTTONS_THEME.contained}
          onPress={() => navigationAction()}
        />
        <ShareSection disciplineTitle={disciplineTitle} results={results} />
      </Root>
    </SafeAreaView>
  )
}

export default ExerciseFinishedScreen
