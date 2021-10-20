import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { CircularFinishIcon, NextArrow, RepeatIcon } from '../../assets/images'
import Button from '../components/Button'
import Loading from '../components/Loading'
import Title from '../components/Title'
import { BUTTONS_THEME, ExerciseKeys, RESULTS } from '../constants/data'
import labels from '../constants/labels.json'
import { COLORS } from '../constants/theme/colors'
import { DocumentResultType, RoutesParamsType } from '../navigation/NavigationTypes'
import VocabularyListItem from './vocabulary-list/components/VocabularyListItem'

const Root = styled.View`
  background-color: ${prop => prop.theme.colors.lunesWhite};
  height: 100%;
  width: 100%;
  padding-bottom: 0;
  padding-top: 4%;
`

const ScreenTitle = styled.Text`
  text-align: center;
  font-size: ${props => props.theme.fonts.headingFontSize};
  color: ${prop => prop.theme.colors.lunesGreyDark};
  font-family: ${props => props.theme.fonts.contentFontBold};
  margin-bottom: 1%;
  margin-top: 6%;
`

const Description = styled.Text`
  text-align: center;
  font-size: ${props => props.theme.fonts.defaultFontSize};
  color: ${prop => prop.theme.colors.lunesGreyMedium};
  font-family: ${props => props.theme.fonts.contentFontRegular};
`

const StyledList = styled(FlatList as new () => FlatList<DocumentResultType>)`
  flex-grow: 0;
  width: 100%;
  margin-bottom: 6%;
`

const DarkLabel = styled.Text`
  text-align: center;
  color: ${prop => prop.theme.colors.lunesBlack};
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${props => props.theme.fonts.defaultFontSize};
  letter-spacing: ${props => props.theme.fonts.capsLetterSpacing};
  text-transform: uppercase;
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
`

const Arrow = styled(NextArrow)`
  margin-left: 5px;
`

const LightLabel = styled.Text`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-family: ${props => props.theme.fonts.contentFontBold};
  color: ${prop => prop.theme.colors.lunesWhite};
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
  margin-left: 10px;
  text-transform: uppercase;
`

export const styles = StyleSheet.create({
  footer: {
    marginTop: 25,
    alignItems: 'center'
  }
})

interface ResultScreenPropsType {
  route: RouteProp<RoutesParamsType, 'ResultScreen'>
  navigation: StackNavigationProp<RoutesParamsType, 'ResultScreen'>
}

const ResultScreen = ({ route, navigation }: ResultScreenPropsType): JSX.Element => {
  const { result, counts, resultType } = route.params
  const { exercise } = result
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
      setEntries(result.results.filter(({ result }: DocumentResultType) => result === resultType.key))
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Exercises', result)}>
            <CircularFinishIcon />
          </TouchableOpacity>
        )
      })

      setIsLoading(false)
    }, [navigation, resultType, result])
  )

  const Header = (
    <Title>
      <>
        <Icon width={38} height={38} />
        <ScreenTitle>
          {' '}
          {title} {labels.results.entries}
        </ScreenTitle>
        <Description>{`${counts[resultType.key]} ${labels.results.of} ${counts.total} ${
          labels.home.words
        }`}</Description>
      </>
    </Title>
  )

  const Item = ({ item }: { item: DocumentResultType }): JSX.Element => <VocabularyListItem document={item} />

  const repeatIncorrectEntries = (): void =>
    navigation.navigate('WriteExercise', {
      discipline: { ...result.discipline },
      retryData: { data: entries }
    })

  const retryButton =
    entries.length > 0 && ['similar', 'incorrect'].includes(resultType.key) ? (
      <Button onPress={repeatIncorrectEntries} buttonTheme={BUTTONS_THEME.dark}>
        <>
          <RepeatIcon fill={COLORS.lunesWhite} />
          <LightLabel>
            {resultType.key === 'similar' ? labels.results.similar : labels.results.wrong} {labels.results.viewEntries}
          </LightLabel>
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
          <DarkLabel>
            {labels.results.show} {nextResultType.title} {labels.results.entries}
          </DarkLabel>
          <Arrow />
        </>
      </Button>
    </>
  )

  return (
    <Root>
      <Loading isLoading={isLoading}>
        <StyledList
          data={entries}
          ListHeaderComponent={Header}
          renderItem={Item}
          keyExtractor={item => `${item.id}`}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={Footer}
          ListFooterComponentStyle={styles.footer}
        />
      </Loading>
    </Root>
  )
}

export default ResultScreen
