import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ComponentType, useCallback, useState } from 'react'
import { FlatList, StatusBar } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import DisciplineItem from '../components/DisciplineItem'
import ServerResponseHandler from '../components/ServerResponseHandler'
import Title from '../components/Title'
import { Discipline } from '../constants/endpoints'
import { useLoadDisciplines } from '../hooks/useLoadDisciplines'
import { RoutesParams } from '../navigation/NavigationTypes'
import { childrenDescription, childrenLabel } from '../services/helpers'

const Root = styled.View`
  background-color: ${props => props.theme.colors.lunesWhite};
  height: 100%;
`

const ItemText = styled.View`
  flex-direction: row;
  align-items: center;
`

const StyledList = styled(FlatList)`
  width: 100%;
` as ComponentType as new () => FlatList<Discipline>

const Description = styled.Text<{ selected: boolean }>`
  text-align: center;
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  padding-left: ${props => props.theme.spacings.xxs};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  color: ${prop => (prop.selected ? prop.theme.colors.lunesWhite : prop.theme.colors.lunesGreyMedium)};
`

const BadgeLabel = styled.Text<{ selected: boolean }>`
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
  min-width: ${wp('6%')}px;
  height: ${wp('4%')}px;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  color: ${prop => (prop.selected ? prop.theme.colors.lunesGreyMedium : prop.theme.colors.lunesWhite)};
  background-color: ${prop => (prop.selected ? prop.theme.colors.lunesWhite : prop.theme.colors.lunesGreyMedium)};
  font-size: ${prop => prop.theme.fonts.smallFontSize};
`

interface DisciplineSelectionScreenProps {
  route: RouteProp<RoutesParams, 'DisciplineSelection'>
  navigation: StackNavigationProp<RoutesParams, 'DisciplineSelection'>
}

const DisciplineSelectionScreen = ({ route, navigation }: DisciplineSelectionScreenProps): JSX.Element => {
  const { discipline } = route.params

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const { data: disciplines, error, loading, refresh } = useLoadDisciplines(discipline)

  useFocusEffect(
    useCallback(() => {
      setSelectedId(-1)
    }, [])
  )

  const handleNavigation = (selectedItem: Discipline): void => {
    setSelectedId(selectedItem.id)

    if (selectedItem.isLeaf) {
      navigation.navigate('Exercises', { discipline: selectedItem })
    } else {
      navigation.push('DisciplineSelection', {
        discipline: selectedItem
      })
    }
  }

  const ListItem = ({ item }: { item: Discipline }): JSX.Element | null => {
    if (item.numberOfChildren === 0) {
      return null
    }
    const selected = item.id === selectedId

    return (
      <DisciplineItem selected={selected} item={item} onPress={() => handleNavigation(item)}>
        <ItemText>
          <BadgeLabel selected={selected}>{item.numberOfChildren}</BadgeLabel>
          <Description selected={selected}>{childrenLabel(item)}</Description>
        </ItemText>
      </DisciplineItem>
    )
  }

  return (
    <Root>
      <StatusBar backgroundColor='blue' barStyle='dark-content' />
      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        <StyledList
          ListHeaderComponent={<Title title={discipline.title} description={childrenDescription(discipline)} />}
          data={disciplines}
          renderItem={ListItem}
          keyExtractor={({ id }) => id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </ServerResponseHandler>
    </Root>
  )
}

export default DisciplineSelectionScreen
