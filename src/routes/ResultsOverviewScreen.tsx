import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ComponentType, ReactElement } from 'react'
import { FlatList, StatusBar, StyleSheet } from 'react-native'
import styled from 'styled-components/native'

import { DoubleCheckIcon, RepeatIcon } from '../../assets/images'
import Button from '../components/Button'
import ListItem from '../components/ListItem'
import Title from '../components/Title'
import Trophy from '../components/Trophy'
import { BUTTONS_THEME, ExerciseKeys, EXERCISES, RESULTS, Result, SIMPLE_RESULTS } from '../constants/data'
import labels from '../constants/labels.json'
import { Counts, RoutesParams } from '../navigation/NavigationTypes'

const Root = styled.View`
  background-color: ${props => props.theme.colors.lunesWhite};
  height: 100%;
  align-items: center;
  padding-left: 4%;
  padding-right: 4%;
`

const StyledList = styled(FlatList)`
  flex-grow: 0;
  width: 100%;
  margin-bottom: 6%;
` as ComponentType as new () => FlatList<Result>

const HeaderText = styled.Text`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
  font-family: ${props => props.theme.fonts.contentFontBold};
  letter-spacing: ${props => props.theme.fonts.capsLetterSpacing};
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

interface ResultOverviewScreenProps {
  route: RouteProp<RoutesParams, 'ResultsOverview'>
  navigation: StackNavigationProp<RoutesParams, 'ResultsOverview'>
}

const ResultsOverview = ({ navigation, route }: ResultOverviewScreenProps): ReactElement => {
  const { exercise, results, discipline } = route.params.result
  const { level, description, title } = EXERCISES[exercise]
  const [counts, setCounts] = React.useState<Counts>({ total: 0, correct: 0, incorrect: 0, similar: 0 })

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
          <DoubleCheckIcon />
        </RightHeader>
      )
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

  const navigateToResult = (item: Result) => {
    navigation.navigate('ResultScreen', {
      result: { ...route.params.result },
      resultType: item,
      counts
    })
  }

  const Item = ({ item }: { item: Result }): ReactElement | null => {
    const hideAlmostCorrect = item.key === SIMPLE_RESULTS.similar // TODO will be adjusted in LUN-222
    if (hideAlmostCorrect) {
      return null
    }

    const count = counts[item.key]

    const description = `${count} ${labels.results.of} ${counts.total} ${labels.general.words}`
    const icon = <item.Icon width={30} height={30} />

    return <ListItem title={item.title} icon={icon} description={description} onPress={() => navigateToResult(item)} />
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
