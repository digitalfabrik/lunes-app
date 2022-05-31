import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import {
  CheckCircleIconWhite,
  ListIcon,
  RepeatIcon,
  OpenLockIcon,
  CloseIcon,
  CloseIconWhite
} from '../../../assets/images'
import Button from '../../components/Button'
import { HeadingBackground } from '../../components/text/Heading'
import { BUTTONS_THEME, EXERCISES } from '../../constants/data'
import labels from '../../constants/labels.json'
import { RoutesParams } from '../../navigation/NavigationTypes'
import ShareSection from './components/ShareSection'

const Root = styled.View`
  background-color: ${prop => prop.theme.colors.background};
  height: 100%;
  align-items: center;
`
const UpperSection = styled.View<{ unlockedNextExercise: boolean }>`
  width: 140%;
  height: 45%;
  background-color: ${prop => (prop.unlockedNextExercise ? prop.theme.colors.correct : prop.theme.colors.primary)};
  border-bottom-left-radius: ${hp('60%')}px;
  border-bottom-right-radius: ${hp('60%')}px;
  margin-bottom: ${props => props.theme.spacings.lg};
  justify-content: center;
  align-items: center;
`
const MessageContainer = styled.View`
  width: 60%;
  margin-top: ${props => props.theme.spacings.sm};
`
const Message = styled(HeadingBackground)<{ unlockedNextExercise: boolean }>`
  color: ${prop => (prop.unlockedNextExercise ? prop.theme.colors.primary : prop.theme.colors.background)};
  text-align: center;
`
const Icon = styled.TouchableOpacity`
  position: absolute;
  top: 50px;
  right: 100px;
`

interface Props {
  route: RouteProp<RoutesParams, 'ExerciseFinished'>
  navigation: StackNavigationProp<RoutesParams, 'ExerciseFinished'>
}

const ExerciseFinishedScreen = ({ navigation, route }: Props): ReactElement => {
  const {
    exercise,
    results,
    disciplineTitle,
    disciplineId,
    documents,
    closeExerciseAction,
    unlockedNextExercise = false
  } = route.params
  const [message, setMessage] = React.useState<string>('')

  React.useEffect(() => {
    const correctResults = results.filter(doc => doc.result === 'correct')
    const correct = correctResults.length / results.length
    if (unlockedNextExercise) {
      setMessage(labels.results.unlockedExercise)
    } else if (correct > 2 / 3) {
      setMessage(labels.results.feedbackGood)
    } else if (correct > 1 / 3) {
      setMessage(labels.results.feedbackMedium)
    } else {
      setMessage(labels.results.feedbackBad)
    }
  }, [results])

  const repeatExercise = (): void => {
    navigation.navigate(EXERCISES[exercise].screen, {
      documents,
      disciplineId,
      disciplineTitle,
      closeExerciseAction
    })
  }

  const checkResults = (): void => {
    navigation.navigate('Result', route.params)
  }

  return (
    <Root>
      <UpperSection unlockedNextExercise={unlockedNextExercise}>
        <Icon onPress={checkResults}>
          {unlockedNextExercise ? (
            <CloseIcon width={wp('6%')} height={wp('6%')} />
          ) : (
            <CloseIconWhite width={wp('6%')} height={wp('6%')} />
          )}
        </Icon>
        {unlockedNextExercise ? (
          <OpenLockIcon width={wp('8%')} height={wp('8%')} />
        ) : (
          <CheckCircleIconWhite width={wp('8%')} height={wp('8%')} />
        )}
        <MessageContainer>
          <Message unlockedNextExercise={unlockedNextExercise}>{message}</Message>
        </MessageContainer>
      </UpperSection>

      <Button
        label={labels.results.checkEntries}
        iconLeft={ListIcon}
        buttonTheme={BUTTONS_THEME.contained}
        onPress={checkResults}
      />
      <Button
        label={labels.results.retryExercise}
        iconLeft={RepeatIcon}
        buttonTheme={BUTTONS_THEME.outlined}
        onPress={repeatExercise}
      />
      <ShareSection disciplineTitle={disciplineTitle} results={results} />
    </Root>
  )
}

export default ExerciseFinishedScreen
