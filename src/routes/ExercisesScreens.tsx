import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ComponentType, useState } from 'react'
import { FlatList, View, Alert } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { Arrow } from '../../assets/images'
import Title from '../components/Title'
import { EXERCISES, ExerciseType } from '../constants/data'
import labels from '../constants/labels.json'
import { COLORS } from '../constants/theme/colors'
import { RoutesParamsType } from '../navigation/NavigationTypes'

const Root = styled.View`
  background-color: ${prop => prop.theme.colors.lunesWhite};
  height: 100%;
`

const ItemTitle = styled(FlatList)`
  width: ${wp('100%')}px;
  padding-right: ${wp('5%')}px;
  padding-left: ${wp('5%')}px;
` as ComponentType as new () => FlatList<ExerciseType>

const Description = styled.Text<{ selected: boolean }>`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  color: ${props => (props.selected ? props.theme.colors.white : props.theme.colors.lunesGreyDark)};
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

  background-color: ${props => (props.selected ? props.theme.colors.lunesBlack : props.theme.colors.white)};
  border-color: ${props => (props.selected ? props.theme.colors.white : props.theme.colors.lunesBlackUltralight)};
`
const StyledItemTitle = styled.Text<{ selected: boolean }>`
  text-align: left;
  font-size: ${props => props.theme.fonts.largeFontSize};
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
  letter-spacing: ${props => props.theme.fonts.listTitleLetterSpacing};
  margin-bottom: 2px;
  font-family: ${props => props.theme.fonts.contentFontBold};

  color: ${props => (props.selected ? props.theme.colors.lunesWhite : props.theme.colors.lunesGreyDark)};
`

const StyledLevel = styled.View`
  margin-top: 11px;
`

interface ExercisesScreenPropsType {
  route: RouteProp<RoutesParamsType, 'Exercises'>
  navigation: StackNavigationProp<RoutesParamsType, 'Exercises'>
}

const ExercisesScreen = ({ route, navigation }: ExercisesScreenPropsType): JSX.Element => {
  const { discipline } = route.params
  const { title, numberOfChildren } = discipline
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  useFocusEffect(
    React.useCallback(() => {
      setSelectedKey(null)
    }, [])
  )

  const Header = <Title title={title} description={`${numberOfChildren} ${labels.home.words}`} />

  const Item = ({ item }: { item: ExerciseType }): JSX.Element | null => {
    const selected = item.key.toString() === selectedKey

    return (
      <Container selected={selected} onPress={() => handleNavigation(item)}>
        <View>
          <StyledItemTitle selected={selected}>{item.title}</StyledItemTitle>
          <Description selected={selected}>{item.description}</Description>
          <StyledLevel as={item.Level} />
        </View>
        <Arrow fill={item.key.toString() === selectedKey ? COLORS.lunesRedLight : COLORS.lunesBlack} />
      </Container>
    )
  }

  const handleNavigation = (item: ExerciseType): void => {
    if (item.title === labels.exercises.wordChoice.title && numberOfChildren < 4) {
      Alert.alert(labels.exercises.wordChoice.errorWrongModuleSize)
    } else {
      setSelectedKey(item.key.toString())
      navigation.navigate(EXERCISES[item.key].nextScreen, {
        discipline: discipline
      })
    }
  }

  return (
    <Root>
      <ItemTitle
        data={EXERCISES}
        ListHeaderComponent={Header}
        renderItem={Item}
        keyExtractor={item => item.key.toString()}
        showsVerticalScrollIndicator={false}
      />
    </Root>
  )
}

export default ExercisesScreen
