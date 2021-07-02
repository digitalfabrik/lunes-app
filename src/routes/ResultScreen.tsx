import React from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { BUTTONS_THEME, ExerciseKeys, RESULTS } from '../constants/data'
import { COLORS } from '../constants/colors'
import { CircularFinishIcon, NextArrow, RepeatIcon } from '../../assets/images'
import Title from '../components/Title'
import Loading from '../components/Loading'
import VocabularyListItem from './vocabulary-list/components/VocabularyListItem'
import Button from '../components/Button'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { DocumentResultType, RoutesParamsType } from '../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import labels from '../constants/labels.json'

export const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.lunesWhite,
    height: '100%',
    width: '100%',
    paddingBottom: 0,
    paddingTop: 32
  },
  screenTitle: {
    textAlign: 'center',
    fontSize: wp('5%'),
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-SemiBold',
    marginBottom: 4,
    marginTop: 11
  },
  description: {
    textAlign: 'center',
    fontSize: wp('4%'),
    color: COLORS.lunesGreyMedium,
    fontFamily: 'SourceSansPro-Regular'
  },
  list: {
    flexGrow: 0,
    width: '100%',
    marginBottom: hp('6%')
  },
  darkLabel: {
    textAlign: 'center',
    color: COLORS.lunesBlack,
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: wp('3.5%'),
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    fontWeight: '600'
  },
  arrow: {
    marginLeft: 5
  },
  footer: {
    marginTop: 15,
    alignItems: 'center'
  },
  lightLabel: {
    fontSize: wp('3.2%'),
    fontFamily: 'SourceSansPro-SemiBold',
    color: COLORS.lunesWhite,
    fontWeight: '600',
    marginLeft: 10,
    textTransform: 'uppercase'
  }
})

interface ResultScreenPropsType {
  route: RouteProp<RoutesParamsType, 'ResultScreen'>
  navigation: StackNavigationProp<RoutesParamsType, 'ResultScreen'>
}

const ResultScreen = ({ route, navigation }: ResultScreenPropsType): JSX.Element => {
  const { extraParams, results, counts, resultType } = route.params
  const { exercise } = extraParams
  const [entries, setEntries] = React.useState<DocumentResultType[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const { Icon, title, order } = resultType

  let nextResultType = RESULTS.find(result => result.order === (order + 1) % RESULTS.length) ?? RESULTS[0]
  if (
    nextResultType.key === 'similar' &&
    (exercise === ExerciseKeys.articleChoiceExercise || exercise === ExerciseKeys.wordChoiceExercise)
  ) {
    nextResultType = RESULTS[2]
  }

  useFocusEffect(
    React.useCallback(() => {
      setEntries(results.filter(({ result }: DocumentResultType) => result === resultType.key))
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Exercises', { extraParams: extraParams })}>
            <CircularFinishIcon />
          </TouchableOpacity>
        )
      })

      setIsLoading(false)
    }, [extraParams, navigation, resultType, results])
  )

  const Header = (
    <Title>
      <>
        <Icon width={38} height={38} />
        <Text style={styles.screenTitle}>
          {' '}
          {title} {labels.results.entries}
        </Text>
        <Text style={styles.description}>{`${counts[resultType.key]} ${labels.results.of} ${counts.total} ${
          labels.home.words
        }`}</Text>
      </>
    </Title>
  )

  const Item = ({ item }: { item: DocumentResultType }): JSX.Element => <VocabularyListItem document={item} />

  const repeatIncorrectEntries = (): void =>
    navigation.navigate('WriteExercise', {
      retryData: { data: entries },
      extraParams
    })

  const retryButton =
    entries.length > 0 && ['similar', 'incorrect'].includes(resultType.key) ? (
      <Button onPress={repeatIncorrectEntries} theme={BUTTONS_THEME.dark}>
        <>
          <RepeatIcon fill={COLORS.lunesWhite} />
          <Text style={styles.lightLabel}>
            {resultType.key === 'similar' ? labels.results.similar : labels.results.wrong} {labels.results.viewEntries}
          </Text>
        </>
      </Button>
    ) : null

  const Footer = (
    <>
      {exercise === ExerciseKeys.writeExercise && retryButton}

      <Button
        onPress={() =>
          navigation.navigate('ResultScreen', {
            ...route.params,
            resultType: nextResultType
          })
        }>
        <>
          <Text style={styles.darkLabel}>
            {labels.results.show} {nextResultType.title} {labels.results.entries}
          </Text>
          <NextArrow style={styles.arrow} />
        </>
      </Button>
    </>
  )

  return (
    <View style={styles.root}>
      <Loading isLoading={isLoading}>
        <FlatList
          data={entries}
          style={styles.list}
          ListHeaderComponent={Header}
          renderItem={Item}
          keyExtractor={item => `${item.id}`}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={Footer}
          ListFooterComponentStyle={styles.footer}
        />
      </Loading>
    </View>
  )
}

export default ResultScreen
