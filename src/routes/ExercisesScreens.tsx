import React, { useState } from 'react'
import { View, FlatList } from 'react-native'
import { Arrow } from '../../assets/images'
import Title from '../components/Title'
import { EXERCISES, ExerciseType } from '../constants/data'
import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { COLORS } from '../constants/theme/colors'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import labels from '../constants/labels.json'
import styled from 'styled-components/native'

const Root = styled.View`
  background-color: ${COLORS.lunesWhite};
  height: 100%;
  padding-top: 10%;
`
const ItemTitle = styled(FlatList as new () => FlatList<ExerciseType>)`
  width: 100%;
  padding-right: 5%;
  padding-left: 5%;
`

const ScreenDescription = styled.Text`
  font-size: ${wp('4%')}px;
  color: ${COLORS.lunesGreyMedium};
  font-family: 'SourceSansPro-Regular';
`
const Description = styled.Text`
  font-size: ${wp('4%')}px;
  font-family: 'SourceSansPro-Regular';
  font-weight: normal;
  color: ${(prop: StyledProps) => (prop.selected ? COLORS.white : COLORS.lunesGreyDark)};
`
const ScreenTitle = styled.Text`
  text-align: center;
  font-size: ${wp('5%')}px;
  color: ${COLORS.lunesGreyDark};
  font-family: 'SourceSansPro-SemiBold';
`
const Container = styled.Pressable`
  align-self: center;
  padding-top: 17px;
  padding-bottom: 17px;
  padding-right: 8px;
  padding-left: 16px;
  margin-bottom: 8px;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  border-width: 1px;
  border-style: solid;
  border-radius: 2px;

  background-color: ${(prop: StyledProps) => (prop.selected ? COLORS.lunesBlack : COLORS.white)};
  border-color: ${(prop: StyledProps) => (prop.selected ? COLORS.white : COLORS.lunesBlackUltralight)};
`
const StyledItemTitle = styled.Text`
  text-align: left;
  font-size: ${wp('4.5%')}px;
  font-weight: 600;
  letter-spacing: 0.11px;
  margin-bottom: 2px;
  font-family: 'SourceSansPro-SemiBold';

  color: ${(prop: StyledProps) => (prop.selected ? COLORS.lunesWhite : COLORS.lunesGreyDark)};
`
const StyledTitle = styled.Text`
  color: ${COLORS.lunesBlack};
  font-family: 'SourceSansPro-SemiBold';
  font-size: ${wp('4%')}px;
  text-transform: uppercase;
  font-weight: 600;
  margin-left: 15px;
`
const HeaderLeft = styled.TouchableOpacity`
  padding-left: 15;
  flex-direction: row;
  align-items: center;
  z-index: 100;
`
const StyledLevel = styled.View`
  margin-top: 11px;
`

interface ExercisesScreenPropsType {
  route: RouteProp<RoutesParamsType, 'Exercises'>
  navigation: StackNavigationProp<RoutesParamsType, 'Exercises'>
}

interface StyledProps {
  selected: boolean
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
