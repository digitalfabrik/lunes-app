import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ComponentType } from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { DoubleCheckCircleIconWhite, ArrowRightIcon, RepeatIcon } from '../../assets/images'
import Button from '../components/Button'
import Loading from '../components/Loading'
import Title from '../components/Title'
import { BUTTONS_THEME, ExerciseKeys, RESULTS } from '../constants/data'
import labels from '../constants/labels.json'
import { DocumentResult, RoutesParams } from '../navigation/NavigationTypes'
import VocabularyListItem from './vocabulary-list/components/VocabularyListItem'

const Root = styled.View`
  background-color: ${prop => prop.theme.colors.background};
  height: 100%;
  width: 100%;
  padding-bottom: 0;
`

const StyledList = styled(FlatList)`
  flex-grow: 0;
  width: 100%;
  margin-bottom: 6%;
` as ComponentType as new () => FlatList<DocumentResult>

export const styles = StyleSheet.create({
  footer: {
    marginTop: 25,
    alignItems: 'center'
  }
})

interface ResultScreenProps {
  route: RouteProp<RoutesParams, 'ResultScreen'>
  navigation: StackNavigationProp<RoutesParams, 'ResultScreen'>
}

const ResultDetailScreen = ({ route, navigation }: ResultScreenProps): JSX.Element => {
  const { result, counts, resultType } = route.params
  const { exercise } = result
  const [entries, setEntries] = React.useState<DocumentResult[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const { Icon, title, order } = resultType

  let nextResultType = RESULTS.find(elem => elem.order === (order + 1) % RESULTS.length) ?? RESULTS[0]
  // TODO will be adjusted in LUN-222
  if (nextResultType.key === 'similar') {
    nextResultType = RESULTS[2]
  }

  useFocusEffect(
    React.useCallback(() => {
      setEntries(result.results.filter(({ result }: DocumentResult) => result === resultType.key))
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Exercises', result)}>
            <DoubleCheckCircleIconWhite />
          </TouchableOpacity>
        )
      })

      setIsLoading(false)
    }, [navigation, resultType, result])
  )

  const Header = (
    <Title
      titleIcon={<Icon width={38} height={38} />}
      title={` \n${title} ${labels.results.entries}`}
      description={`${counts[resultType.key]} ${labels.results.of} ${counts.total} ${labels.general.words}`}
    />
  )

  const Item = ({ item }: { item: DocumentResult }): JSX.Element => <VocabularyListItem document={item} />

  const repeatIncorrectEntries = (): void =>
    navigation.navigate('WriteExercise', {
      discipline: { ...result.discipline },
      retryData: { data: entries }
    })

  const label = `${resultType.key === 'similar' ? labels.results.similar : labels.results.wrong} ${
    labels.results.viewEntries
  }`

  const retryButton =
    entries.length > 0 && ['similar', 'incorrect'].includes(resultType.key) ? (
      <Button
        label={label}
        onPress={repeatIncorrectEntries}
        buttonTheme={BUTTONS_THEME.contained}
        iconLeft={RepeatIcon}
      />
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
        }
        label={`${labels.results.show} ${nextResultType.title} ${labels.results.entries}`}
        iconLeft={ArrowRightIcon}
        buttonTheme={BUTTONS_THEME.text}
      />
    </>
  )

  return (
    <Root>
      <Loading isLoading={isLoading}>
        <StyledList
          data={entries}
          ListHeaderComponent={Header}
          renderItem={Item}
          keyExtractor={({ id }) => id.toString()}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={Footer}
          ListFooterComponentStyle={styles.footer}
        />
      </Loading>
    </Root>
  )
}

export default ResultDetailScreen
