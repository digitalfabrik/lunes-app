import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import DisciplineListItem from '../components/DisciplineListItem'
import RouteWrapper from '../components/RouteWrapper'
import ServerResponseHandler from '../components/ServerResponseHandler'
import Title from '../components/Title'
import { Discipline } from '../constants/endpoints'
import { useLoadDisciplines } from '../hooks/useLoadDisciplines'
import { RoutesParams } from '../navigation/NavigationTypes'
import { childrenDescription } from '../services/helpers'

const List = styled.FlatList`
  margin: 0 ${props => props.theme.spacings.md};
  height: 100%;
` as unknown as typeof FlatList

type UnitSelectionScreenProps = {
  route: RouteProp<RoutesParams, 'UnitSelection'>
  navigation: StackNavigationProp<RoutesParams, 'UnitSelection'>
}

const UnitSelectionScreen = ({ route, navigation }: UnitSelectionScreenProps): JSX.Element => {
  const { job } = route.params
  const { data: units, error, loading, refresh } = useLoadDisciplines({ parent: job })

  const handleNavigation = (selectedItem: Discipline): void => {
    navigation.navigate('StandardExercises', {
      contentType: 'standard',
      discipline: selectedItem,
      disciplineTitle: selectedItem.title,
      disciplineId: selectedItem.id,
      vocabularyItems: null,
    })
  }

  const renderListItem = ({ item }: { item: Discipline }): JSX.Element => (
    <DisciplineListItem item={item} onPress={() => handleNavigation(item)} showProgress />
  )

  return (
    <RouteWrapper>
      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        <List
          ListHeaderComponent={<Title title={job.title} description={childrenDescription(job)} />}
          data={units}
          renderItem={renderListItem}
          keyExtractor={({ id }) => id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </ServerResponseHandler>
    </RouteWrapper>
  )
}

export default UnitSelectionScreen
