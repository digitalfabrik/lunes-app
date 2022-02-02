import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ComponentType, useState } from 'react'
import { FlatList, View, Alert } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled, { useTheme } from 'styled-components/native'

import { ChevronRight } from '../../assets/images'
import Title from '../components/Title'
import { EXERCISES, Exercise } from '../constants/data'
import labels from '../constants/labels.json'
import { RoutesParams } from '../navigation/NavigationTypes'
import { childrenDescription } from '../services/helpers'
import { MIN_WORDS } from './choice-exercises/WordChoiceExerciseScreen'

const Root = styled.View`
  background-color: ${prop => prop.theme.colors.background};
  height: 100%;
`

const ItemTitle = styled(FlatList)`
  width: ${wp('100%')}px;
  padding-right: ${wp('5%')}px;
  padding-left: ${wp('5%')}px;
` as ComponentType as new () => FlatList<Exercise>

const Description = styled.Text<{ selected: boolean }>`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  color: ${props => (props.selected ? props.theme.colors.white : props.theme.colors.textColor)};
`

const Container = styled.Pressable<{ selected: boolean }>`
  align-self: center;
  padding: 17px 8px 17px 16px;
  margin-bottom: 8px;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  border-width: 1px;
  border-style: solid;
  border-radius: 2px;

  background-color: ${props => (props.selected ? props.theme.colors.primary : props.theme.colors.white)};
  border-color: ${props => (props.selected ? props.theme.colors.white : props.theme.colors.disabled)};
`
const StyledItemTitle = styled.Text<{ selected: boolean }>`
  text-align: left;
  font-size: ${props => props.theme.fonts.largeFontSize};
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
  letter-spacing: ${props => props.theme.fonts.listTitleLetterSpacing};
  margin-bottom: 2px;
  font-family: ${props => props.theme.fonts.contentFontBold};

  color: ${props => (props.selected ? props.theme.colors.background : props.theme.colors.textColor)};
`

const StyledLevel = styled.View`
  margin-top: 11px;
`

interface ExercisesScreenProps {
  route: RouteProp<RoutesParams, 'Exercises'>
  navigation: StackNavigationProp<RoutesParams, 'Exercises'>
}

const ExercisesScreen = ({ route, navigation }: ExercisesScreenProps): JSX.Element => {
  const { discipline } = route.params
  const { title } = discipline
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const theme = useTheme()

  useFocusEffect(
    React.useCallback(() => {
      setSelectedKey(null)
    }, [])
  )

  const Header = <Title title={title} description={childrenDescription(discipline)} />

  const handleNavigation = (item: Exercise): void => {
    if (item.title === labels.exercises.wordChoice.title && discipline.numberOfChildren < MIN_WORDS) {
      Alert.alert(labels.exercises.wordChoice.errorWrongModuleSize)
    } else {
      setSelectedKey(item.key.toString())
      navigation.navigate(EXERCISES[item.key].nextScreen, {
        discipline
      })
    }
  }

  const Item = ({ item }: { item: Exercise }): JSX.Element | null => {
    const selected = item.key.toString() === selectedKey

    return (
      <Container selected={selected} onPress={() => handleNavigation(item)}>
        <View>
          <StyledItemTitle selected={selected}>{item.title}</StyledItemTitle>
          <Description selected={selected}>{item.description}</Description>
          <StyledLevel as={item.Level} />
        </View>
        <ChevronRight fill={item.key.toString() === selectedKey ? theme.colors.secondarySelectedColor : theme.colors.primary} />
      </Container>
    )
  }

  return (
    <Root>
      <ItemTitle
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
