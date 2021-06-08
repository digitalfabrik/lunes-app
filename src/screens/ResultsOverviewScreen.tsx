import React from 'react'
import { View, Text, Pressable, FlatList, TouchableOpacity, StatusBar, StyleSheet } from 'react-native'
import Title from '../components/Title'
import { Arrow, RepeatIcon, FinishIcon } from '../../assets/images'
import { RESULTS, BUTTONS_THEME, EXERCISES, ResultType } from '../constants/data'
import { RouteProp, useFocusEffect } from '@react-navigation/native'
import Button from '../components/Button'
import { COLORS } from '../constants/colors'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { CountsType, RoutesParamsType } from '../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'

export const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.lunesWhite,
    height: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 32
  },
  list: {
    flexGrow: 0,
    width: '100%',
    marginBottom: hp('6%')
  },
  screenDescription: {
    fontSize: wp('4%'),
    color: COLORS.lunesGreyMedium,
    fontFamily: 'SourceSansPro-Regular',
    lineHeight: 18,
    marginTop: 7
  },
  description: {
    fontSize: wp('4%'),
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-Regular'
  },
  screenTitle: {
    textAlign: 'center',
    fontSize: wp('5%'),
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-SemiBold',
    paddingBottom: hp('3%')
  },
  screenSubTitle: {
    textAlign: 'center',
    fontSize: wp('4%'),
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-SemiBold'
  },
  container: {
    alignSelf: 'center',
    paddingVertical: 17,
    paddingRight: 8,
    paddingLeft: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderColor: COLORS.lunesBlackUltralight,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 2
  },
  clickedContainer: {
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingVertical: 17,
    paddingRight: 8,
    paddingLeft: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.lunesBlack,
    borderColor: COLORS.white,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 2
  },
  clickedItemTitle: {
    textAlign: 'left',
    fontSize: wp('5%'),
    fontWeight: '600',
    letterSpacing: 0.11,
    marginBottom: 2,
    color: COLORS.lunesWhite,
    fontFamily: 'SourceSansPro-SemiBold'
  },
  clickedItemDescription: {
    fontSize: wp('4%'),
    fontWeight: 'normal',
    color: COLORS.white,
    fontFamily: 'SourceSansPro-Regular'
  },
  title2: {
    textAlign: 'left',
    fontSize: wp('4.5%'),
    fontWeight: '600',
    letterSpacing: 0.11,
    marginBottom: 2,
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-SemiBold'
  },
  level: {
    marginTop: hp('1%')
  },
  leftSide: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    marginLeft: 10,
    display: 'flex',
    flexDirection: 'column'
  },
  lightLabel: {
    fontSize: wp('3.5%'),
    fontFamily: 'SourceSansPro-SemiBold',
    color: COLORS.lunesWhite,
    fontWeight: '600',
    marginLeft: 10,
    textTransform: 'uppercase'
  },
  headerText: {
    fontSize: wp('3.5%'),
    fontWeight: '600',
    fontFamily: 'SourceSansPro-SemiBold',
    color: COLORS.lunesBlack,
    textTransform: 'uppercase',
    marginRight: 8
  },
  rightHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  header: {
    shadowOpacity: 0,
    elevation: 0,
    borderBottomColor: COLORS.lunesBlackUltralight,
    borderBottomWidth: 1
  },
  footer: {
    marginTop: 25,
    alignItems: 'center'
  }
})

interface ResultOverviewScreenPropsType {
  route: RouteProp<RoutesParamsType, 'ResultsOverview'>
  navigation: StackNavigationProp<RoutesParamsType, 'ResultsOverview'>
}

const ResultsOverview = ({ navigation, route }: ResultOverviewScreenPropsType): JSX.Element => {
  const { extraParams, results } = route.params
  const { exercise } = extraParams
  const { Level, description, title } = EXERCISES.filter(({ title }) => title === exercise)[0]
  const [selectedKey, setSelectedKey] = React.useState<string | null>(null)
  const [counts, setCounts] = React.useState<CountsType>({ total: 0, correct: 0, incorrect: 0, similar: 0 })

  useFocusEffect(React.useCallback(() => setSelectedKey(null), []))
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.rightHeader} onPress={() => navigation.navigate('Exercises', { extraParams })}>
          <Text style={styles.headerText}>ÜBUNG BEENDEN</Text>
          <FinishIcon />
        </TouchableOpacity>
      ),
      headerStyle: styles.header
    })

    setCounts({
      total: results.length,
      correct: results.filter(({ result }) => result === 'correct').length,
      incorrect: results.filter(({ result }) => result === 'incorrect').length,
      similar: results.filter(({ result }) => result === 'similar').length
    })
  }, [results, navigation, extraParams])

  const Header = (
    <Title>
      <>
        <Text style={styles.screenTitle}>Ergebnis-Übersicht</Text>
        <Text style={styles.screenSubTitle}>{title}</Text>
        <Text style={styles.screenDescription}>{description}</Text>
        <Level style={styles.level} />
      </>
    </Title>
  )

  const Item = ({ item }: { item: ResultType }): JSX.Element => {
    const handleNavigation = ({ key }: ResultType): void => {
      setSelectedKey(key)

      navigation.navigate('ResultScreen', {
        extraParams,
        resultType: item,
        results,
        counts
      })
    }

    const count = counts[item.key]

    const selected = item.key === selectedKey
    const iconColor = selected ? COLORS.lunesWhite : COLORS.lunesGreyDark
    const arrowColor = selected ? COLORS.lunesRedLight : COLORS.lunesBlack
    const itemStyle = selected ? styles.clickedContainer : styles.container
    const itemTitleStyle = selected ? styles.clickedItemTitle : styles.title2
    const descriptionStyle = selected ? styles.clickedItemDescription : styles.description

    return (
      <Pressable style={itemStyle} onPress={() => handleNavigation(item)}>
        <View style={styles.leftSide}>
          <item.Icon fill={iconColor} width={30} height={30} />
          <View style={styles.text}>
            <Text style={itemTitleStyle}>{item.title}</Text>
            <Text style={descriptionStyle}>{`${count} von ${counts.total} Wörter`}</Text>
          </View>
        </View>
        <Arrow fill={arrowColor} />
      </Pressable>
    )
  }

  const repeatExercise = (): void => {
    navigation.navigate('VocabularyTrainer', {
      retryData: { data: results },
      extraParams
    })
  }

  const Footer = (
    <Button onPress={repeatExercise} theme={BUTTONS_THEME.dark}>
      <>
        <RepeatIcon fill={COLORS.lunesWhite} />
        <Text style={styles.lightLabel}>GESAMTE ÜBUNG WIEDERHOLEN</Text>
      </>
    </Button>
  )

  return (
    <View style={styles.root}>
      <StatusBar barStyle='dark-content' />

      <FlatList
        data={RESULTS}
        style={styles.list}
        ListHeaderComponent={Header}
        renderItem={Item}
        keyExtractor={item => item.key}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={Footer}
        ListFooterComponentStyle={styles.footer}
      />
    </View>
  )
}

export default ResultsOverview
