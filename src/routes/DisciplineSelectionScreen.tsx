import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ComponentType } from 'react'
import { FlatList, StatusBar } from 'react-native'
import styled from 'styled-components/native'

import DisciplineListItem from '../components/DisciplineListItem'
import ServerResponseHandler from '../components/ServerResponseHandler'
import Title from '../components/Title'
import { Discipline } from '../constants/endpoints'
import { useLoadDisciplines } from '../hooks/useLoadDisciplines'
import { RoutesParams } from '../navigation/NavigationTypes'
import { childrenDescription } from '../services/helpers'

const Root = styled.View`
  background-color: ${props => props.theme.colors.lunesWhite};
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

  const Item = ({ item }: { item: Discipline }): JSX.Element => (
    <DisciplineListItem item={item} onPress={() => handleNavigation(item)} badge />
  )

  return (
    <Root>
      <StatusBar backgroundColor='blue' barStyle='dark-content' />
      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        <StyledList
          ListHeaderComponent={<Title title={discipline.title} description={childrenDescription(discipline)} />}
          data={disciplines}
          renderItem={Item}
          keyExtractor={({ id }) => id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </ServerResponseHandler>
    </Root>
  )
}

export default DisciplineSelectionScreen
