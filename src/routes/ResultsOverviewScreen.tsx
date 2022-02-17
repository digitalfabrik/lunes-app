import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ComponentType, ReactElement } from 'react'
import { FlatList, StatusBar, StyleSheet } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { ChevronRight, DoubleCheckIcon, RepeatIcon } from '../../assets/images'
import Button from '../components/Button'
import Title from '../components/Title'
import Trophy from '../components/Trophy'
import { BUTTONS_THEME, ExerciseKeys, EXERCISES, RESULTS, Result, SIMPLE_RESULTS } from '../constants/data'
import labels from '../constants/labels.json'
import { COLORS } from '../constants/theme/colors'
import { Counts, RoutesParams } from '../navigation/NavigationTypes'

const Root = styled.View`
  background-color: ${props => props.theme.colors.lunesWhite};
  height: 100%;
  align-items: center;
  padding-left: ${props => props.theme.spacings.sm};
  padding-right: ${props => props.theme.spacings.sm};
`

const StyledList = styled(FlatList)`
  flex-grow: 0;
  width: 100%;
  margin-bottom: ${props => props.theme.spacings.md}
` as ComponentType as new () => FlatList<Result>

const Description = styled.Text<{ selected: boolean }>`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${prop => (prop.selected ? prop.theme.colors.white : prop.theme.colors.lunesGreyDark)};
`

const Contained = styled.Pressable<{ selected: boolean }>`
  align-self: center;
  padding: ${props =>
    `${props.theme.spacings.sm} ${props.theme.spacings.md} ${props.theme.spacings.sm} ${props.theme.spacings.sm}`};
  margin-bottom: ${props => props.theme.spacings.xs}
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  border-width: 1px;
  border-style: solid;
  border-radius: 2px;
  background-color: ${prop => (prop.selected ? prop.theme.colors.lunesBlack : prop.theme.colors.white)};
  border-color: ${prop => (prop.selected ? prop.theme.colors.white : prop.theme.colors.lunesBlackUltralight)};
`
const StyledItemTitle = styled.Text<{ selected: boolean }>`
  text-align: left;
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
  margin-bottom: 2px;
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${props => props.theme.fonts.largeFontSize};
  letter-spacing: ${props => props.theme.fonts.listTitleLetterSpacing};
  color: ${prop => (prop.selected ? prop.theme.colors.lunesWhite : prop.theme.colors.lunesGreyDark)};
`

const LeftSide = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`
const StyledText = styled.View`
  margin-left: ${props => props.theme.spacings.xs};
  display: flex;
  flex-direction: column;
`
const HeaderText = styled.Text`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
  font-family: ${props => props.theme.fonts.contentFontBold};
  letter-spacing: ${props => props.theme.fonts.capsLetterSpacing};
  color: ${prop => prop.theme.colors.lunesBlack};
  text-transform: uppercase;
  margin-right: ${props => props.theme.spacings.xs};
`
const RightHeader = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
  shadow-opacity: 0;
  elevation: 0;
  border-bottom-color: ${prop => prop.theme.colors.lunesBlackUltralight};
  border-bottom-width: 1px;
  margin-right: ${props => props.theme.spacings.sm};
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

interface ResultOverviewScreenProps {
  route: RouteProp<RoutesParams, 'ResultsOverview'>
  navigation: StackNavigationProp<RoutesParams, 'ResultsOverview'>
}

const ResultsOverview = ({ navigation, route }: ResultOverviewScreenProps): ReactElement => {
  const { exercise, results, discipline } = route.params.result
  const { level, description, title } = EXERCISES[exercise]
  const [selectedKey, setSelectedKey] = React.useState<string | null>(null)
  const [counts, setCounts] = React.useState<Counts>({ total: 0, correct: 0, incorrect: 0, similar: 0 })

  useFocusEffect(React.useCallback(() => setSelectedKey(null), []))

  const repeatExercise = (): void => {
    navigation.navigate(EXERCISES[exercise].nextScreen, {
      discipline,
      ...(exercise === ExerciseKeys.writeExercise ? { retryData: { data: results } } : {})
    })
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <RightHeader
          onPress={() =>
            navigation.navigate('Exercises', {
              discipline: { ...discipline }
            })
          }>
          <HeaderText>{labels.general.header.cancelExercise}</HeaderText>
          <DoubleCheckIcon width={wp('6%')} height={wp('6%')} />
        </RightHeader>
      ),
      headerRightContainerStyle: { flex: 1 }
    })

    setCounts({
      total: results.length,
      correct: results.filter(({ result }) => result === 'correct').length,
      incorrect: results.filter(({ result }) => result === 'incorrect').length,
      similar: results.filter(({ result }) => result === 'similar').length
    })
  }, [results, navigation, discipline])

  const Header = (
    <StyledTitle title={labels.results.resultsOverview} subtitle={title} description={description}>
      <Trophy level={level} />
    </StyledTitle>
  )

  const Item = ({ item }: { item: Result }): ReactElement | null => {
    const hideAlmostCorrect = item.key === SIMPLE_RESULTS.similar // TODO will be adjusted in LUN-222
    if (hideAlmostCorrect) {
      return null
    }
    const handleNavigation = ({ key }: Result): void => {
      setSelectedKey(key)

      navigation.navigate('ResultScreen', {
        result: { ...route.params.result },
        resultType: item,
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
          <item.Icon fill={iconColor} width={wp('7%')} height={wp('7%')} />
          <StyledText>
            <StyledItemTitle selected={selected}>{item.title}</StyledItemTitle>
            <Description
              selected={
                selected
              }>{`${count} ${labels.results.of} ${counts.total} ${labels.general.words}`}</Description>
          </StyledText>
        </LeftSide>
        <ChevronRight fill={arrowColor} width={wp('6%')} height={wp('6%')} />
      </Contained>
    )
  }

  const Footer = (
    <Button
      label={labels.results.retryExercise}
      iconLeft={RepeatIcon}
      onPress={repeatExercise}
      buttonTheme={BUTTONS_THEME.contained}
    />
  )

  return (
    <Root>
      <StatusBar barStyle='dark-content' />
      <StyledList
        data={RESULTS}
        ListHeaderComponent={Header}
        renderItem={Item}
        keyExtractor={({ key }) => key}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={Footer}
        ListFooterComponentStyle={styles.footer}
      />
    </Root>
  )
}

export default ResultsOverview
