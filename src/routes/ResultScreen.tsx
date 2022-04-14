import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ComponentType, ReactElement } from 'react'
import { FlatList, StatusBar, StyleSheet } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { DoubleCheckIcon, RepeatIcon } from '../../assets/images'
import Button from '../components/Button'
import ListItem from '../components/ListItem'
import Title from '../components/Title'
import Trophy from '../components/Trophy'
import { SubheadingPrimary } from '../components/text/Subheading'
import { BUTTONS_THEME, EXERCISES, RESULTS, Result, SIMPLE_RESULTS } from '../constants/data'
import labels from '../constants/labels.json'
import { useTabletHeaderHeight } from '../hooks/useTabletHeaderHeight'
import { RoutesParams } from '../navigation/NavigationTypes'
import ShareButton from './exercise-finished/components/ShareButton'

const Root = styled.View`
  background-color: ${props => props.theme.colors.background};
  height: 100%;
  align-items: center;
  padding: 0 ${props => props.theme.spacings.sm};
`

const StyledList = styled(FlatList)`
  flex-grow: 0;
  width: 100%;
  margin-bottom: ${props => props.theme.spacings.md};
` as ComponentType as new () => FlatList<Result>

const HeaderText = styled(SubheadingPrimary)`
  letter-spacing: ${props => props.theme.fonts.capsLetterSpacing};
  text-transform: uppercase;
  margin-right: ${props => props.theme.spacings.xs};
`
const RightHeader = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
  shadow-opacity: 0;
  elevation: 0;
  border-bottom-color: ${prop => prop.theme.colors.disabled};
  border-bottom-width: 1px;
  margin-right: ${props => props.theme.spacings.sm};
`
const StyledTitle = styled(Title)`
  elevation: 0;
  border-bottom-color: ${prop => prop.theme.colors.disabled};
  border-bottom-width: 1px;
`

export const styles = StyleSheet.create({
  footer: {
    marginTop: 25,
    alignItems: 'center'
  }
})

interface Props {
  route: RouteProp<RoutesParams, 'Result'>
  navigation: StackNavigationProp<RoutesParams, 'Result'>
}

const ResultScreen = ({ navigation, route }: Props): ReactElement => {
  const { exercise, results, disciplineTitle, documents, closeExerciseAction } = route.params
  const { level, description, title } = EXERCISES[exercise]

  // Set only height for tablets since header doesn't scale auto
  const headerHeight = useTabletHeaderHeight(wp('15%'))

  const repeatExercise = (): void => {
    navigation.navigate(EXERCISES[exercise].nextScreen, {
      documents,
      disciplineTitle,
      closeExerciseAction
    })
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <RightHeader onPress={() => navigation.dispatch(closeExerciseAction)}>
          <HeaderText>{labels.general.header.cancelExercise}</HeaderText>
          <DoubleCheckIcon width={wp('6%')} height={wp('6%')} />
        </RightHeader>
      ),
      headerRightContainerStyle: { flex: 1 },
      headerStyle: { height: headerHeight }
    })
  }, [results, navigation, headerHeight, closeExerciseAction])

  const Header = (
    <StyledTitle title={labels.results.resultsOverview} subtitle={title} description={description}>
      <Trophy level={level} />
    </StyledTitle>
  )
  const navigateToResult = (item: Result) => {
    navigation.navigate('ResultDetail', {
      resultType: item,
      documents,
      disciplineTitle,
      exercise,
      results,
      closeExerciseAction
    })
  }

  const Item = ({ item }: { item: Result }): ReactElement | null => {
    const hideAlmostCorrect = item.key === SIMPLE_RESULTS.similar // TODO will be adjusted in LUN-222
    if (hideAlmostCorrect) {
      return null
    }

    const count = results.filter(it => it.result === item.key).length

    const description = `${count} ${labels.results.of} ${results.length} ${labels.general.words}`
    const icon = <item.Icon width={wp('7%')} height={wp('7%')} />

    return <ListItem title={item.title} icon={icon} description={description} onPress={() => navigateToResult(item)} />
  }

  const Footer = (
    <>
      <Button
        label={labels.results.retryExercise}
        iconLeft={RepeatIcon}
        onPress={repeatExercise}
        buttonTheme={BUTTONS_THEME.contained}
      />
      <ShareButton disciplineTitle={disciplineTitle} results={results} />
    </>
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

export default ResultScreen
