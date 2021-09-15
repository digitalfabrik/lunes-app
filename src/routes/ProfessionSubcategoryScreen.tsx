import React, { useState } from 'react'
import { FlatList, LogBox, StatusBar, Text } from 'react-native'
import Title from '../components/Title'
import { DisciplineType } from '../constants/endpoints'
import { RouteProp } from '@react-navigation/native'
import Loading from '../components/Loading'
import MenuItem from '../components/MenuItem'
import { COLORS } from '../constants/theme/colors'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import { useLoadDisciplines } from '../hooks/useLoadDisciplines'
import labels from '../constants/labels.json'
import styled from 'styled-components/native'

const Root = styled.View`
  background-color: ${COLORS.lunesWhite};
  height: 100%;
  padding-top: 5%;
`
const ItemText = styled.View`
  flex-direction: row;
  align-items: center;
`
const StyledList = styled(FlatList as new () => FlatList<DisciplineType>)`
  width: 100%;
`

const Description = styled.Text`
  text-align: center;
  font-size: ${wp('4%')}px;
  font-family: 'SourceSansPro-Regular';
  padding-left: 5px;
  font-weight: normal;
  color: ${(prop: StyledProps) => (prop.selected ? COLORS.lunesWhite : COLORS.lunesGreyMedium)};
`
const ScreenTitle = styled.Text`
  text-align: center;
  font-size: ${wp('5%')}px;
  color: ${COLORS.lunesGreyDark};
  font-family: 'SourceSansPro-SemiBold';
`
const BadgeLabel = styled.Text`
  font-family: 'SourceSansPro-SemiBold';
  font-weight: 600;
  min-width: ${wp('6%')}px;
  height: ${wp('4%')}px;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  color: ${(prop: StyledProps) => (prop.selected ? COLORS.lunesGreyMedium : COLORS.lunesWhite)};
  font-size: ${(prop: StyledProps) => (prop.selected ? wp('12') : wp('3%'))}px;
  background-color: ${(prop: StyledProps) => (prop.selected ? COLORS.lunesWhite : COLORS.lunesGreyMedium)};
`

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state'])
interface ProfessionSubcategoryScreenPropsType {
  route: RouteProp<RoutesParamsType, 'ProfessionSubcategory'>
  navigation: StackNavigationProp<RoutesParamsType, 'ProfessionSubcategory'>
}

interface StyledProps {
  selected: boolean
}

const ProfessionSubcategoryScreen = ({ route, navigation }: ProfessionSubcategoryScreenPropsType): JSX.Element => {
  const { extraParams } = route.params
  const { module } = extraParams

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const { data: disciplines, error, loading } = useLoadDisciplines(module)

  const titleCOMP = (
    <Title>
      <>
        <ScreenTitle>{module?.title}</ScreenTitle>
        <Description selected={false}>
          {module.numberOfChildren} {module.numberOfChildren === 1 ? labels.home.unit : labels.home.units}
        </Description>
      </>
    </Title>
  )

  const ListItem = ({ item }: { item: DisciplineType }): JSX.Element | null => {
    if (item.numberOfChildren === 0) {
      return null
    }
    const selected = item.id === selectedId
    const descriptionForWord = item.numberOfChildren === 1 ? labels.home.word : labels.home.words
    const descriptionForUnit = item.numberOfChildren === 1 ? labels.home.unit : labels.home.units
    const description = module.isLeaf ? descriptionForWord : descriptionForUnit

    return (
      <MenuItem
        selected={item.id === selectedId}
        title={item.title}
        icon={item.icon}
        onPress={() => handleNavigation(item)}>
        <ItemText>
          <BadgeLabel selected={selected}>{item.numberOfChildren}</BadgeLabel>
          <Description selected={selected}>{description}</Description>
        </ItemText>
      </MenuItem>
    )
  }

  const handleNavigation = (selectedItem: DisciplineType): void => {
    setSelectedId(module.id)
    if (!module.isLeaf) {
      navigation.push('ProfessionSubcategory', {
        extraParams: {
          module: selectedItem,
          parentTitle: module.title
        }
      })
    } else {
      navigation.navigate('Exercises', {
        extraParams: {
          disciplineID: module.id,
          disciplineTitle: module.title,
          disciplineIcon: module.icon,
          trainingSetId: selectedItem.id,
          trainingSet: selectedItem.title,
          documentsLength: selectedItem.numberOfChildren
        }
      })
    }
  }
  return (
    <Root>
      <StatusBar backgroundColor='blue' barStyle='dark-content' />
      <Loading isLoading={loading}>
        <StyledList
          data={disciplines}
          ListHeaderComponent={titleCOMP}
          renderItem={ListItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </Loading>
      <Text>{error}</Text>
    </Root>
  )
}
export default ProfessionSubcategoryScreen
