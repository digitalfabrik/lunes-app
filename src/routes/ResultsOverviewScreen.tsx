import React from 'react'
import { FlatList, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Title from '../components/Title'
import { Arrow, FinishIcon, RepeatIcon } from '../../assets/images'
import { BUTTONS_THEME, ExerciseKeys, EXERCISES, RESULTS, ResultType, SIMPLE_RESULTS } from '../constants/data'
import { RouteProp, useFocusEffect } from '@react-navigation/native'
import Button from '../components/Button'
import { COLORS } from '../constants/colors'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { CountsType, RoutesParamsType } from '../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import labels from '../constants/labels.json'
import styled from 'styled-components/native'

const Root = styled.View`
  background-color: ${COLORS.lunesWhite};
  height: 100%;
  align-items: center;
  padding-left: ${wp('5%')};
  padding-right: ${wp('5%')};
  padding-top: ${hp('4.5%')};
`
const StyledList = styled.FlatList`
  flex-grow: 0;
  width: ${wp('100%')};
  margin-bottom: ${hp('6%')};
` as unknown as typeof FlatList

const ScreenDescription = styled.Text`
  font-size: ${wp('4%')};
  color: ${COLORS.lunesGreyMedium};
  font-family: 'SourceSansPro-Regular';
  line-height: 30;
  margin-top: 7;
`
const Description = styled.Text`
  font-size: ${wp('4%')};
  font-weight: normal;
  font-family: 'SourceSansPro-Regular';
  color: ${(prop: StyledProps) => (prop.selected ? COLORS.white : COLORS.lunesGreyDark)};
`
const ScreenTitle = styled.Text`
  text-align: center;
  font-size: ${wp('5%')};
  color: ${COLORS.lunesGreyDark};
  font-family: 'SourceSansPro-SemiBold';
  padding-bottom: ${hp('3%')};
`
const ScreenSubTitle = styled.Text`
  text-align: center;
  font-size: ${wp('4%')};
  color: ${COLORS.lunesGreyDark};
  font-family: 'SourceSansPro-SemiBold';
`
const Contained = styled.Pressable`
  align-self: center;
  padding-top: 17;
  padding-bottom: 17;
  padding-right: 8;
  padding-left: 16;
  margin-bottom: 8;
  flex-direction: row;
  align-items: center;
  width: 90%;
  justify-content: space-between;
  border-width: 1;
  border-style: solid;
  border-radius: 2;
  background-color: ${(prop: StyledProps) => (prop.selected ? COLORS.lunesBlack : COLORS.white)};
  border-color: ${(prop: StyledProps) => (prop.selected ? COLORS.white : COLORS.lunesBlackUltralight)};
`
const ItemTitle2 = styled.Text`
  text-align: left;
  font-weight: 600;
  letter-spacing: 0.11;
  margin-bottom: 2;
  font-family: 'SourceSansPro-SemiBold';
  font-size: ${(prop: StyledProps) => (prop.selected ? wp('5%') : wp('4.5%'))};
  color: ${(prop: StyledProps) => (prop.selected ? COLORS.lunesWhite : COLORS.lunesGreyDark)};
`
const StyledLevel = styled.View`
  margin-top: ${hp('1%')};
`
const LeftSide = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`
const StyledText = styled.View`
  margin-left: 10;
  display: flex;
  flex-direction: column;
`
const LightLabel = styled.Text`
  font-size: ${wp('3.5%')};
  font-family: 'SourceSansPro-SemiBold';
  color: ${COLORS.lunesWhite};
  font-weight: 600;
  margin-left: 10;
  text-transform: uppercase;
`
const HeaderText = styled.Text`
  font-size: ${wp('3.5%')};
  font-weight: 600;
  font-family: 'SourceSansPro-SemiBold';
  color: ${COLORS.lunesBlack};
  text-transform: uppercase;
  margin-right: 8;
`
const RightHeader = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const StyledTitle = styled(Title)`
  shadowopacity: 0;
  elevation: 0;
  border-bottom-color: ${COLORS.lunesBlackUltralight};
  border-bottom-width: 1;
`

export const styles = StyleSheet.create({
  header: {
    shadowOpacity: 0,
    elevation: 0,
    borderBottomColor: COLORS.lunesBlackUltralight,
    borderBottomWidth: 1
  }
})

interface StyledProps {
  selected: boolean
}
interface ResultOverviewScreenPropsType {
  route: RouteProp<RoutesParamsType, 'ResultsOverview'>
  navigation: StackNavigationProp<RoutesParamsType, 'ResultsOverview'>
  selected: boolean
}

const ResultsOverview = ({ navigation, route }: ResultOverviewScreenPropsType): JSX.Element => {
  const { extraParams, results } = route.params
  const { exercise } = extraParams
  const { Level, description, title } = EXERCISES[exercise]
  const [selectedKey, setSelectedKey] = React.useState<string | null>(null)
  const [counts, setCounts] = React.useState<CountsType>({ total: 0, correct: 0, incorrect: 0, similar: 0 })
  useFocusEffect(React.useCallback(() => setSelectedKey(null), []))
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <RightHeader onPress={() => navigation.navigate('Exercises', { extraParams })}>
          <HeaderText>{labels.general.header.cancelExercise}</HeaderText>
          <FinishIcon />
        </RightHeader>
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
    <StyledTitle>
      <>
        <ScreenTitle>{labels.results.resultsOverview}</ScreenTitle>
        <ScreenSubTitle>{title}</ScreenSubTitle>
        <ScreenDescription>{description}</ScreenDescription>
        <StyledLevel as={Level} />
      </>
    </StyledTitle>
  )

  const Item = ({ item }: { item: ResultType }): JSX.Element | null => {
    const hideAlmostCorrect = exercise !== ExerciseKeys.writeExercise && item.key === SIMPLE_RESULTS.similar
    if (hideAlmostCorrect) {
      return null
    }
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
    return (
      <Contained selected={selected} onPress={() => handleNavigation(item)}>
        <LeftSide>
          <item.Icon fill={iconColor} width={30} height={30} />
          <StyledText>
            <ItemTitle2 selected={selected}>{item.title}</ItemTitle2>
            <Description
              selected={selected}>{`${count} ${labels.results.of} ${counts.total} ${labels.home.words}`}</Description>
          </StyledText>
        </LeftSide>
        <Arrow fill={arrowColor} />
      </Contained>
    )
  }

  const repeatExercise = (): void => {
    navigation.navigate(EXERCISES[exercise].nextScreen, {
      retryData: { data: results },
      extraParams
    })
  }

  const Footer = (
    <Button onPress={repeatExercise} theme={BUTTONS_THEME.dark}>
      <>
        <RepeatIcon fill={COLORS.lunesWhite} />
        <LightLabel>{labels.results.retryExercise}</LightLabel>
      </>
    </Button>
  )

  return (
    <Root>
      <StatusBar barStyle='dark-content' />
      <StyledList
        data={RESULTS}
        ListHeaderComponent={Header}
        renderItem={Item}
        keyExtractor={item => item.key}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={Footer}
        ListFooterComponentStyle={{ alignItems: 'center', marginTop: 25 }}
        contentContainerStyle={{ alignItems: 'center' }}
      />
    </Root>
  )
}

export default ResultsOverview
