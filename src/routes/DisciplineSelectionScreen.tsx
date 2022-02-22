import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ComponentType, useCallback, useState } from 'react'
import { FlatList, StatusBar } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import DisciplineItem from '../components/DisciplineItem'
import ServerResponseHandler from '../components/ServerResponseHandler'
import Title from '../components/Title'
import { ContentSecondaryLight } from '../components/text/Content'
import { Discipline } from '../constants/endpoints'
import { useLoadDisciplines } from '../hooks/useLoadDisciplines'
import { RoutesParams } from '../navigation/NavigationTypes'
import { childrenDescription, childrenLabel } from '../services/helpers'

const Root = styled.View`
  background-color: ${props => props.theme.colors.background};
  height: 100%;
`

const ItemText = styled.View`
  flex-direction: row;
  align-items: center;
`

const StyledList = styled(FlatList)`
  width: 100%;
` as ComponentType as new () => FlatList<Discipline>

const Description = styled(ContentSecondaryLight)<{ selected: boolean }>`
  text-align: center;
  padding-left: ${props => props.theme.spacings.xxs};
  color: ${prop => (prop.selected ? prop.theme.colors.background : prop.theme.colors.textSecondary)};
`

const BadgeLabel = styled.Text<{ selected: boolean }>`
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
  min-width: ${wp('6%')}px;
  height: ${wp('4%')}px;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  color: ${prop => (prop.selected ? prop.theme.colors.textSecondary : prop.theme.colors.background)};
  background-color: ${prop => (prop.selected ? prop.theme.colors.background : prop.theme.colors.textSecondary)};
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
