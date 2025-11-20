import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { UnitListItem } from '../components/DisciplineListItem'
import RouteWrapper from '../components/RouteWrapper'
import ServerResponseHandler from '../components/ServerResponseHandler'
import Title from '../components/Title'
import useLoadUnits from '../hooks/useLoadUnits'
import { StandardUnit } from '../models/Unit'
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
  const { data: units, error, loading, refresh } = useLoadUnits(job.id)

  const handleNavigation = (selectedItem: StandardUnit): void => {
    navigation.navigate('StandardExercises', {
      unit: selectedItem,
      jobTitle: selectedItem.title,
    })
  }

  const renderListItem = ({ item }: { item: StandardUnit }): JSX.Element => (
    <UnitListItem unit={item} onPress={() => handleNavigation(item)} />
  )

  return (
    <RouteWrapper>
      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        <List
          ListHeaderComponent={<Title title={job.title} description={childrenDescription(job)} />}
          data={units}
          renderItem={renderListItem}
          keyExtractor={({ id }) => JSON.stringify(id)}
          showsVerticalScrollIndicator={false}
        />
      </ServerResponseHandler>
    </RouteWrapper>
  )
}

export default UnitSelectionScreen
