import React, { useState } from 'react'
import { FlatList, LogBox, StatusBar, Text } from 'react-native'
import Title from '../components/Title'
import axios from '../services/axios'
import { ENDPOINTS, ProfessionSubcategoryType } from '../constants/endpoints'
import { RouteProp, useFocusEffect } from '@react-navigation/native'
import Loading from '../components/Loading'
import MenuItem from '../components/MenuItem'
import { COLORS } from '../constants/colors'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import labels from '../constants/labels.json'
import styled from 'styled-components/native'

const Root = styled.View`
  background-color: ${COLORS.lunesWhite};
  height: 100%;
  padding-top: ${hp('5%')};
`
const ItemText = styled.View`
  flex-direction: row;
  align-items: center;
`
const List = (styled.FlatList`
  width: ${wp('100%')};
  `as unknown) as typeof FlatList;
const Description = styled.Text`
  text-align: center;
  font-size: ${wp('4%')};
  font-family: 'SourceSansPro-Regular';
  padding-left: 5px;
  font-weight: normal;
  color: ${(prop: StyledProps) => prop.selected ? COLORS.lunesWhite : COLORS.lunesGreyMedium};
`
const ScreenTitle = styled.Text`
  text-align: center;
  font-size: ${wp('5%')};
  color: ${COLORS.lunesGreyDark};
  font-family: 'SourceSansPro-SemiBold';
`
const BadgeLabel = styled.Text`
  font-family: 'SourceSansPro-SemiBold';
  font-weight: 600;
  min-width: ${wp('6%')};
  height: ${wp('4%')};
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  color: ${(prop: StyledProps) => prop.selected ? COLORS.lunesGreyMedium : COLORS.lunesWhite};
  font-size: ${(prop: StyledProps) => prop.selected ? 12 : wp('3%')};
  background-color: ${(prop: StyledProps) => prop.selected ? COLORS.lunesWhite : COLORS.lunesGreyMedium};
`;

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state'])
interface ProfessionSubcategoryScreenPropsType {
  route: RouteProp<RoutesParamsType, 'ProfessionSubcategory'>
  navigation: StackNavigationProp<RoutesParamsType, 'ProfessionSubcategory'>
}

interface StyledProps {
  selected: boolean;
}

const ProfessionSubcategoryScreen = ({ route, navigation }: ProfessionSubcategoryScreenPropsType): JSX.Element => {
  const { extraParams } = route.params
  const { disciplineID, disciplineTitle } = extraParams
  const [subcategories, setSubcategories] = useState<ProfessionSubcategoryType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [count, setCount] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  useFocusEffect(
    React.useCallback(() => {
      const url = ENDPOINTS.subCategories.all.replace(':id', disciplineID.toString())
      axios
        .get(url)
        .then(response => {
          setSubcategories(response.data)
          setCount(response.data.length)
          setError(null)
        })
        .catch(e => {
          setError(e.message)
        })
        .finally(() => {
          setIsLoading(false)
        })
      setSelectedId(-1)
    }, [disciplineID])
  )
  const titleCOMP = (
    <Title>
      <>
        <ScreenTitle>{disciplineTitle}</ScreenTitle>
        <Description selected={false}>
          {count} {count === 1 ? labels.home.unit : labels.home.units}
        </Description>
      </>
    </Title>
  )
  const Item = ({ item }: { item: ProfessionSubcategoryType }): JSX.Element | null => {
    if (item.total_documents === 0) {
      return null
    }
    const selected = item.id === selectedId
    return (
      <MenuItem
        selected={item.id === selectedId}
        title={item.title}
        icon={item.icon}
        onPress={() => handleNavigation(item)}>
        <ItemText>
          <BadgeLabel selected={selected}>{item.total_documents}</BadgeLabel>
          <Description selected={selected}>{item.total_documents === 1 ? labels.home.word : labels.home.words}</Description>
        </ItemText>
      </MenuItem>
    )
  }
  const handleNavigation = (item: ProfessionSubcategoryType): void => {
    setSelectedId(item.id)
    navigation.navigate('Exercises', {
      extraParams: {
        ...extraParams,
        trainingSetId: item.id,
        trainingSet: item.title
      }
    })
  }
  return (
    <Root>
      <StatusBar backgroundColor='blue' barStyle='dark-content' />
      <Loading isLoading={isLoading}>
        <List
          data={subcategories}
          ListHeaderComponent={titleCOMP}
          renderItem={Item}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </Loading>
      <Text>{error}</Text>
    </Root>
  )
}
export default ProfessionSubcategoryScreen

