import React, { useState } from 'react'
import { FlatList, View } from 'react-native'
import { Arrow } from '../../assets/images'
import Title from '../components/Title'
import { EXERCISES, ExerciseType } from '../constants/data'
import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { COLORS } from '../constants/theme/colors'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import labels from '../constants/labels.json'
import styled from 'styled-components/native'

const Root = styled.View`
  background-color: ${prop => prop.theme.colors.lunesWhite};
  height: 100%;
  padding-top: 10%;
`
const ItemTitle = styled(FlatList as new () => FlatList<ExerciseType>)`
  width: ${wp('100%')}px;
  padding-right: ${wp('5%')}px;
  padding-left: ${wp('5%')}px;
`

const ScreenDescription = styled.Text`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  color: ${props => props.theme.colors.lunesGreyMedium};
  font-family: ${props => props.theme.fonts.contentFontRegular};
`
const Description = styled.Text<{ selected: boolean }>`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  color: ${props => (props.selected ? props.theme.colors.white : props.theme.colors.lunesGreyDark)};
`
const ScreenTitle = styled.Text`
  text-align: center;
  font-size: ${props => props.theme.fonts.headingFontSize};
  color: ${props => props.theme.colors.lunesGreyDark};
  font-family: ${props => props.theme.fonts.contentFontBold};
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
  const { extraParams } = route.params
  const { trainingSet, documentsLength } = extraParams
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  useFocusEffect(
    React.useCallback(() => {
      setSelectedKey(null)
    }, [])
  )

  const Header = (
    <Title>
      <>
        <ScreenTitle>{trainingSet}</ScreenTitle>
        <ScreenDescription>
          {documentsLength} {labels.home.words}
        </ScreenDescription>
      </>
    </Title>
  )

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
    setSelectedKey(item.key.toString())
    navigation.navigate(item.nextScreen, {
      extraParams: {
        ...extraParams,
        exercise: item.key,
        exerciseDescription: item.description,
        level: item.Level
      }
    })
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
