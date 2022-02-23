import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ComponentType } from 'react'
import { FlatList, StatusBar } from 'react-native'
import styled from 'styled-components/native'

import DisciplineItem from '../components/DisciplineItem'
import ServerResponseHandler from '../components/ServerResponseHandler'
import Title from '../components/Title'
import { Discipline } from '../constants/endpoints'
import { useLoadDisciplines } from '../hooks/useLoadDisciplines'
import { RoutesParams } from '../navigation/NavigationTypes'
import { childrenDescription, childrenLabel } from '../services/helpers'

const Root = styled.View`
  background-color: ${props => props.theme.colors.background};
  height: 100%;
`

const StyledList = styled(FlatList)`
  width: 100%;
` as ComponentType as new () => FlatList<Discipline>

interface DisciplineSelectionScreenProps {
  route: RouteProp<RoutesParams, 'DisciplineSelection'>
  navigation: StackNavigationProp<RoutesParams, 'DisciplineSelection'>
}

const DisciplineSelectionScreen = ({ route, navigation }: DisciplineSelectionScreenProps): JSX.Element => {
  const { discipline } = route.params
  const { data: disciplines, error, loading, refresh } = useLoadDisciplines(discipline)

  const handleNavigation = (selectedItem: Discipline): void => {
    if (selectedItem.isLeaf) {
      navigation.navigate('Exercises', { discipline: selectedItem })
    } else {
      navigation.push('DisciplineSelection', {
        discipline: selectedItem
      })
    }
  }

  const ListItem = ({ item }: { item: Discipline }): JSX.Element => (
    <DisciplineItem
      title={item.title}
      icon={item.icon}
      onPress={() => handleNavigation(item)}
      badgeLabel={item.numberOfChildren.toString()}
      description={childrenLabel(item)}
    />
  )

  const relevantDisciplines = disciplines?.filter(it => it.numberOfChildren > 0)

  return (
    <Root>
      <StatusBar backgroundColor='blue' barStyle='dark-content' />
      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        <StyledList
          ListHeaderComponent={<Title title={discipline.title} description={childrenDescription(discipline)} />}
          data={relevantDisciplines}
          renderItem={ListItem}
          keyExtractor={({ id }) => id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </ServerResponseHandler>
    </Root>
  )
}

export default DisciplineSelectionScreen
