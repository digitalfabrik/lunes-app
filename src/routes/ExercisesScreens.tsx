import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ComponentType } from 'react'
import { FlatList, Alert } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import ListItem from '../components/ListItem'
import Title from '../components/Title'
import Trophy from '../components/Trophy'
import { ContentSecondaryLight } from '../components/text/Content'
import ItemTitle from '../components/text/ItemTitle'
import { EXERCISES, Exercise } from '../constants/data'
import labels from '../constants/labels.json'
import { RoutesParams } from '../navigation/NavigationTypes'
import { childrenDescription } from '../services/helpers'
import { MIN_WORDS } from './choice-exercises/WordChoiceExerciseScreen'

const Root = styled.View`
  background-color: ${prop => prop.theme.colors.background};
  height: 100%;
`

const StyledList = styled(FlatList)`
  width: ${wp('100%')}px;
  padding-right: ${props => props.theme.spacings.md};
  padding-left: ${props => props.theme.spacings.md};
` as ComponentType as new () => FlatList<Exercise>

interface ExercisesScreenProps {
  route: RouteProp<RoutesParams, 'Exercises'>
  navigation: StackNavigationProp<RoutesParams, 'Exercises'>
}

const ExercisesScreen = ({ route, navigation }: ExercisesScreenProps): JSX.Element => {
  const { discipline } = route.params
  const { title } = discipline

  const Header = <Title title={title} description={childrenDescription(discipline)} />

  const handleNavigation = (item: Exercise): void => {
    if (item.title === labels.exercises.wordChoice.title && discipline.numberOfChildren < MIN_WORDS) {
      Alert.alert(labels.exercises.wordChoice.errorWrongModuleSize)
    } else {
      navigation.navigate(EXERCISES[item.key].nextScreen, {
        discipline
      })
    }
  }

  const Item = ({ item }: { item: Exercise }): JSX.Element | null => (
    <ListItem title={item.title} description={item.description} onPress={() => handleNavigation(item)}>
      <Trophy level={item.level} />
    </ListItem>
  )

  return (
    <Root>
      <StyledList
        data={EXERCISES}
        ListHeaderComponent={Header}
        renderItem={Item}
        keyExtractor={({ key }) => key.toString()}
        showsVerticalScrollIndicator={false}
      />
    </Root>
  )
}

export default ExercisesScreen
