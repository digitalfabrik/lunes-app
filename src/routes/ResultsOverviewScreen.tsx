import { Arrow, FinishIcon, RepeatIcon } from '../../assets/images'
import Button from '../components/Button'
import Title from '../components/Title'
import { BUTTONS_THEME, ExerciseKeys, EXERCISES, RESULTS, ResultType, SIMPLE_RESULTS } from '../constants/data'
import labels from '../constants/labels.json'
import { COLORS } from '../constants/theme/colors'
import { CountsType, RoutesParamsType } from '../navigation/NavigationTypes'
import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { FlatList, StatusBar, StyleSheet } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

const Root = styled.View`
  background-color: ${props => props.theme.colors.lunesWhite};
  height: 100%;
  align-items: center;
  padding-left: 4%;
  padding-right: 4%;
  padding-top: 4.5%;
`
const StyledList = styled(FlatList as new () => FlatList<ResultType>)`
  flex-grow: 0;
  width: 100%;
  margin-bottom: 6%;
`

const ScreenDescription = styled.Text`
  font-size: ${wp('4%')}px;
  color: ${props => props.theme.colors.lunesGreyMedium};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  line-height: 18px;
  margin-top: 7px;
`
const Description = styled.Text<{ selected: boolean }>`
  font-size: ${wp('4%')}px;
  font-weight: normal;
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${prop => (prop.selected ? prop.theme.colors.white : prop.theme.colors.lunesGreyDark)};
`
const ScreenTitle = styled.Text`
  text-align: center;
  font-size: ${wp('5%')}px;
  color: ${prop => prop.theme.colors.lunesGreyDark};
  font-family: ${props => props.theme.fonts.contentFontBold};
  padding-bottom: 7%;
`
const ScreenSubTitle = styled.Text`
  text-align: center;
  font-size: ${wp('4%')}px;
  color: ${prop => prop.theme.colors.lunesGreyDark};
  font-family: ${props => props.theme.fonts.contentFontBold};
`
const Contained = styled.Pressable<{ selected: boolean }>`
  align-self: center;
  padding: 17px 8px 17px 16px;
  margin-bottom: 8px;
  flex-direction: row;
  align-items: center;
  width: 90%;
  justify-content: space-between;
  border-width: 1px;
  border-style: solid;
  border-radius: 2px;
  background-color: ${prop => (prop.selected ? prop.theme.colors.lunesBlack : prop.theme.colors.white)};
  border-color: ${prop => (prop.selected ? prop.theme.colors.white : prop.theme.colors.lunesBlackUltralight)};
`
const StyledItemTitle = styled.Text<{ selected: boolean }>`
  text-align: left;
  font-weight: 600;
  letter-spacing: 0.11px;
  margin-bottom: 2px;
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${prop => (prop.selected ? wp('5%') : wp('4.5%'))}px;
  color: ${prop => (prop.selected ? prop.theme.colors.lunesWhite : prop.theme.colors.lunesGreyDark)};
`
const StyledLevel = styled.View`
  margin-top: 7%;
`
const LeftSide = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`
const StyledText = styled.View`
  margin-left: 10px;
  display: flex;
  flex-direction: column;
`
const LightLabel = styled.Text`
  font-size: ${wp('3.5%')}px;
  font-family: ${props => props.theme.fonts.contentFontBold};
  color: ${prop => prop.theme.colors.lunesWhite};
  font-weight: 600;
  margin-left: 10px;
  text-transform: uppercase;
`
const HeaderText = styled.Text`
  font-size: ${wp('3.5%')}px;
  font-weight: 600;
  font-family: ${props => props.theme.fonts.contentFontBold};
  color: ${prop => prop.theme.colors.lunesBlack};
  text-transform: uppercase;
  margin-right: 8px;
`
const RightHeader = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
  shadow-opacity: 0;
  elevation: 0;
  border-bottom-color: ${prop => prop.theme.colors.lunesBlackUltralight};
  border-bottom-width: 1px;
`
const StyledTitle = styled(Title)`
  elevation: 0;
  border-bottom-color: ${prop => prop.theme.colors.lunesBlackUltralight};
  border-bottom-width: 1px;
`

export const styles = StyleSheet.create({
  footer: {
    marginTop: 25,
    alignItems: 'center'
  }
})

interface ResultOverviewScreenPropsType {
  route: RouteProp<RoutesParamsType, 'ResultsOverview'>
  navigation: StackNavigationProp<RoutesParamsType, 'ResultsOverview'>
}

const ResultsOverview = ({ navigation, route }: ResultOverviewScreenPropsType): ReactElement => {
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
      )
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

  const Item = ({ item }: { item: ResultType }): ReactElement | null => {
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
            <StyledItemTitle selected={selected}>{item.title}</StyledItemTitle>
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
    <Button onPress={repeatExercise} buttonTheme={BUTTONS_THEME.dark}>
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
        ListFooterComponentStyle={styles.footer}
      />
    </Root>
  )
}

export default ResultsOverview
