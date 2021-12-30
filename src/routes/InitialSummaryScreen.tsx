import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { StatusBar } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { CheckIcon, ListIcon, RepeatIcon } from '../../assets/images'
import Button from '../components/Button'
import { BUTTONS_THEME, ExerciseKeys, EXERCISES } from '../constants/data'
import labels from '../constants/labels.json'
import { COLORS } from '../constants/theme/colors'
import { RoutesParamsType } from '../navigation/NavigationTypes'

const Root = styled.View`
  background-color: ${prop => prop.theme.colors.lunesWhite};
  height: 100%;
  align-items: center;
`
const UpperSection = styled.View`
  width: 140%;
  height: 60%;
  background-color: ${prop => prop.theme.colors.lunesBlack};
  border-bottom-left-radius: ${hp('60%')}px;
  border-bottom-right-radius: ${hp('60%')}px;
  margin-bottom: 8%;
  justify-content: center;
  align-items: center;
`
const MessageContainer = styled.View`
  width: 60%;
  margin-top: 5%;
`
const Message = styled.Text`
  color: ${prop => prop.theme.colors.lunesWhite};
  font-size: ${props => props.theme.fonts.headingFontSize};
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
  text-align: center;
`
const LightLabel = styled.Text`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-family: ${props => props.theme.fonts.contentFontBold};
  letter-spacing: ${props => props.theme.fonts.capsLetterSpacing};
  color: ${prop => prop.theme.colors.lunesWhite};
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
  margin-left: 10px;
  text-transform: uppercase;
`
const DarkLabel = styled.Text`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-family: ${props => props.theme.fonts.contentFontBold};
  letter-spacing: ${props => props.theme.fonts.capsLetterSpacing};
  color: ${prop => prop.theme.colors.lunesBlack};
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
  margin-left: 10px;
  text-transform: uppercase;
`

interface InitialSummaryScreenPropsType {
  route: RouteProp<RoutesParamsType, 'InitialSummary'>
  navigation: StackNavigationProp<RoutesParamsType, 'InitialSummary'>
}

const InitialSummaryScreen = ({ navigation, route }: InitialSummaryScreenPropsType): ReactElement => {
  const { exercise, discipline, results } = route.params.result
  const [message, setMessage] = React.useState<string>('')

  React.useEffect(() => {
    const correctResults = results.filter(doc => doc.result === 'correct')
    const percentageCorrect = (correctResults.length / results.length) * 100
    switch (true) {
      case percentageCorrect > 66:
        setMessage(labels.results.feedbackGood)
        break

      case percentageCorrect > 33:
        setMessage(labels.results.feedbackMedium)
        break

      case percentageCorrect < 33:
        setMessage(labels.results.feedbackBad)
        break
    }
  }, [results])

  const repeatExercise = (): void => {
    navigation.navigate(EXERCISES[exercise].nextScreen, {
      discipline,
      ...(exercise === ExerciseKeys.writeExercise ? { retryData: { data: results } } : {})
    })
  }

  const checkResults = (): void => {
    navigation.navigate('ResultsOverview', {
      result: {
        discipline: discipline,
        exercise: exercise,
        results: results
      },
      repeatExercise
    })
  }

  return (
    <Root>
      <StatusBar barStyle='light-content' />

      <UpperSection>
        <CheckIcon />
        <MessageContainer>
          <Message>{message}</Message>
        </MessageContainer>
      </UpperSection>

      <Button buttonTheme={BUTTONS_THEME.dark} onPress={checkResults}>
        <ListIcon />
        <LightLabel>{labels.results.checkEntries}</LightLabel>
      </Button>

      <Button buttonTheme={BUTTONS_THEME.light} onPress={repeatExercise}>
        <RepeatIcon fill={COLORS.lunesBlack} />
        <DarkLabel>{labels.results.retryExercise}</DarkLabel>
      </Button>
    </Root>
  )
}

export default InitialSummaryScreen
