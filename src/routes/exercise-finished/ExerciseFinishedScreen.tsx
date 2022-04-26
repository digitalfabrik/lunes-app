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
import { BUTTONS_THEME, ExerciseKeys, EXERCISES } from '../../constants/data'
import labels from '../../constants/labels.json'
import { RoutesParams } from '../../navigation/NavigationTypes'
import ShareSection from './components/ShareSection'

const Root = styled.View`
  background-color: ${prop => prop.theme.colors.background};
  height: 100%;
  align-items: center;
`
const UpperSection = styled.View<{ exerciseUnlocked: boolean }>`
  width: 140%;
  height: 45%;
  background-color: ${prop => (prop.exerciseUnlocked ? prop.theme.colors.correct : prop.theme.colors.primary)};
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
const Message = styled(HeadingBackground)<{ exerciseUnlocked: boolean }>`
  color: ${prop => (prop.exerciseUnlocked ? prop.theme.colors.primary : prop.theme.colors.background)};
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
  const { exercise, discipline, results } = route.params.result
  const [message, setMessage] = React.useState<string>('')

  const exerciseUnlocked = false // TODO: LUN-131 logic

  React.useEffect(() => {
    const correctResults = results.filter(doc => doc.result === 'correct')
    const correct = correctResults.length / results.length

    if (exerciseUnlocked) {
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
    navigation.navigate(EXERCISES[exercise].nextScreen, {
      discipline,
      ...(exercise === ExerciseKeys.writeExercise ? { retryData: { data: results } } : {})
    })
  }

  const checkResults = (): void => {
    navigation.navigate('Result', {
      result: {
        discipline,
        exercise,
        results
      }
    })
  }

  return (
    <Root>
      <UpperSection exerciseUnlocked={exerciseUnlocked}>
        <Icon onPress={checkResults}>
          {exerciseUnlocked ? (
            <CloseIcon width={wp('6%')} height={wp('6%')} />
          ) : (
            <CloseIconWhite width={wp('6%')} height={wp('6%')} />
          )}
        </Icon>

        {exerciseUnlocked ? (
          <OpenLockIcon width={wp('8%')} height={wp('8%')} />
        ) : (
          <CheckCircleIconWhite width={wp('8%')} height={wp('8%')} />
        )}
        <MessageContainer>
          <Message exerciseUnlocked={exerciseUnlocked}>{message}</Message>
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
      <ShareSection discipline={discipline} results={results} />
    </Root>
  )
}

export default ExerciseFinishedScreen
