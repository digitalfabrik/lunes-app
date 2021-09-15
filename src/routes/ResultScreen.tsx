import React from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { BUTTONS_THEME, ExerciseKeys, RESULTS } from '../constants/data'
import { COLORS } from '../constants/theme/colors'
import { CircularFinishIcon, NextArrow, RepeatIcon } from '../../assets/images'
import Title from '../components/Title'
import Loading from '../components/Loading'
import VocabularyListItem from './vocabulary-list/components/VocabularyListItem'
import Button from '../components/Button'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { DocumentResultType, RoutesParamsType } from '../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import labels from '../constants/labels.json'
import styled from 'styled-components/native'

const Root = styled.View`
  background-color: ${COLORS.lunesWhite};
  height: 100%;
  width: 100%;
  padding-bottom: 0px;
  padding-top: 4%;
`

const ScreenTitle = styled.Text`
  text-align: center;
  font-size: ${wp('5%')}px;
  color: ${COLORS.lunesGreyDark};
  font-family: 'SourceSansPro-SemiBold';
  margin-bottom: 1%;
  margin-top: 6%;
`

const Description = styled.Text`
  text-align: center;
  font-size: ${wp('4%')}px;
  color: ${COLORS.lunesGreyMedium};
  font-family: 'SourceSansPro-Regular';
`

const StyledList = styled(FlatList as new () => FlatList<DocumentResultType>)`
  flex-grow: 0;
  width: 100%;
  margin-bottom: 6%;
`

const DarkLabel = styled.Text`
  text-align: center;
  color: ${COLORS.lunesBlack};
  font-family: 'SourceSansPro-SemiBold';
  font-size: ${wp('3.5%')}px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  font-weight: 600;
`

const Arrow = styled(NextArrow)`
  margin-left: 5px;
`

const LightLabel = styled.Text`
  font-size: ${wp('3.2%')}px;
  font-family: 'SourceSansPro-SemiBold';
  color: ${COLORS.lunesWhite};
  font-weight: 600;
  margin-left: 10px;
  text-transform: uppercase;
`
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
      retryData: { data: entries },
      extraParams
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
          ListFooterComponentStyle={{ alignItems: 'center', marginTop: 15 }}
        />
      </Loading>
    </Root>
  )
}

export default ResultScreen
