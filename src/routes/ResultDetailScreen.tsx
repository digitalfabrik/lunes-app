import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ComponentType } from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
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
  margin-bottom: ${props => props.theme.spacings.md};
` as ComponentType as new () => FlatList<DocumentResult>

export const styles = StyleSheet.create({
  footer: {
    marginTop: 25,
    alignItems: 'center'
  }
})

interface ResultScreenProps {
  route: RouteProp<RoutesParams, 'ResultDetail'>
  navigation: StackNavigationProp<RoutesParams, 'ResultDetail'>
}

const ResultDetailScreen = ({ route, navigation }: ResultScreenProps): JSX.Element => {
  const { results, resultType, exercise, discipline } = route.params
  const [isLoading, setIsLoading] = React.useState(true)
  const { Icon, title, order } = resultType
  const matchingResults = results.filter(({ result }: DocumentResult) => result === resultType.key)

  let nextResultType = RESULTS.find(elem => elem.order === (order + 1) % RESULTS.length) ?? RESULTS[0]
  // TODO will be adjusted in LUN-222
  if (nextResultType.key === 'similar') {
    nextResultType = RESULTS[2]
  }

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Exercises', { discipline })}>
            <DoubleCheckCircleIconWhite width={wp('8%')} height={wp('8%')} />
          </TouchableOpacity>
        )
      })

      setIsLoading(false)
    }, [navigation, discipline])
  )

  const Header = (
    <Title
      titleIcon={<Icon width={38} height={38} />}
      title={` \n${title} ${labels.results.entries}`}
      description={`${matchingResults.length} ${labels.results.of} ${results.length} ${labels.general.words}`}
    />
  )

  const Item = ({ item }: { item: DocumentResult }): JSX.Element => <VocabularyListItem document={item.document} />

  const repeatIncorrectEntries = (): void =>
    navigation.push('WriteExercise', {
      discipline,
      documents: matchingResults.map(it => it.document)
    })

  const label = `${resultType.key === 'similar' ? labels.results.similar : labels.results.wrong} ${
    labels.results.viewEntries
  }`

  const retryButton =
    matchingResults.length > 0 && ['similar', 'incorrect'].includes(resultType.key) ? (
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
          navigation.navigate('ResultDetail', {
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
          data={matchingResults}
          ListHeaderComponent={Header}
          renderItem={Item}
          keyExtractor={it => it.document.id.toString()}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={Footer}
          ListFooterComponentStyle={styles.footer}
        />
      </Loading>
    </Root>
  )
}

export default ResultDetailScreen
