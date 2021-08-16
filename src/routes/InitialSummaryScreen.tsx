import React, { ReactElement } from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'
import Button from '../components/Button'
import { CheckIcon, ListIcon, RepeatIcon } from '../../assets/images'
import { BUTTONS_THEME, ExerciseKeys, EXERCISES } from '../constants/data'
import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { COLORS } from '../constants/theme/colors'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { DocumentResultType, RoutesParamsType } from '../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import AsyncStorage from '../services/AsyncStorage'
import labels from '../constants/labels.json'

export const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.lunesWhite,
    height: '100%',
    alignItems: 'center'
  },
  upperSection: {
    width: hp('70%'),
    height: hp('60%'),
    backgroundColor: COLORS.lunesBlack,
    borderBottomLeftRadius: hp('60%'),
    borderBottomRightRadius: hp('60%'),
    marginBottom: hp('8%'),
    justifyContent: 'center',
    alignItems: 'center'
  },
  messageContainer: {
    width: wp('60%'),
    marginTop: hp('5%')
  },
  message: {
    color: COLORS.lunesWhite,
    fontSize: wp('5%'),
    fontFamily: 'SourceSansPro-SemiBold',
    fontWeight: '600',
    textAlign: 'center'
  },
  lightLabel: {
    fontSize: wp('3.5%'),
    fontFamily: 'SourceSansPro-SemiBold',
    color: COLORS.lunesWhite,
    fontWeight: '600',
    marginLeft: 10,
    textTransform: 'uppercase'
  },
  darkLabel: {
    fontSize: wp('3.5%'),
    fontFamily: 'SourceSansPro-SemiBold',
    color: COLORS.lunesBlack,
    fontWeight: '600',
    marginLeft: 10,
    textTransform: 'uppercase'
  }
})

interface InitialSummaryScreenPropsType {
  route: RouteProp<RoutesParamsType, 'InitialSummary'>
  navigation: StackNavigationProp<RoutesParamsType, 'InitialSummary'>
}

const InitialSummaryScreen = ({ navigation, route }: InitialSummaryScreenPropsType): ReactElement => {
  const { extraParams } = route.params
  const { exercise, disciplineTitle, trainingSet } = extraParams
  const [results, setResults] = React.useState<DocumentResultType[]>([])
  const [message, setMessage] = React.useState<string>('')

  useFocusEffect(
    React.useCallback(() => {
      if (exercise === ExerciseKeys.writeExercise) {
        AsyncStorage.getExercise(exercise)
          .then(value => {
            if (value !== null) {
              setResults(Object.values(value[disciplineTitle][trainingSet]))
            }
          })
          .catch(e => console.error(e))
      } else {
        setResults(extraParams.results)
      }
    }, [exercise, disciplineTitle, trainingSet, extraParams])
  )

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

  const checkResults = (): void => {
    AsyncStorage.clearSession().catch(e => console.error(e))
    navigation.navigate('ResultsOverview', { extraParams, results })
  }

  const repeatExercise = (): void => {
    navigation.navigate(EXERCISES[exercise].nextScreen, {
      extraParams
    })
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle='light-content' />

      <View style={styles.upperSection}>
        <CheckIcon />
        <View style={styles.messageContainer}>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>

      <Button theme={BUTTONS_THEME.dark} onPress={checkResults}>
        <>
          <ListIcon />
          <Text style={styles.lightLabel}>{labels.results.checkEntries}</Text>
        </>
      </Button>

      <Button theme={BUTTONS_THEME.light} onPress={repeatExercise}>
        <>
          <RepeatIcon fill={COLORS.lunesBlack} />
          <Text style={styles.darkLabel}>{labels.results.retryExercise}</Text>
        </>
      </Button>
    </View>
  )
}

export default InitialSummaryScreen
