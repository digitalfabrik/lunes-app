import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
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
  margin: 0 ${props => props.theme.spacings.md};
`

interface DisciplineSelectionScreenProps {
  route: RouteProp<RoutesParams, 'DisciplineSelection'>
  navigation: StackNavigationProp<RoutesParams, 'DisciplineSelection'>
}

const DisciplineSelectionScreen = ({ route, navigation }: DisciplineSelectionScreenProps): JSX.Element => {
  const { discipline } = route.params
  const { data: disciplines, error, loading, refresh } = useLoadDisciplines({ parent: discipline })

  const handleNavigation = (selectedItem: Discipline): void => {
    if (selectedItem.isLeaf) {
      navigation.navigate('Exercises', {
        discipline: selectedItem,
        disciplineTitle: selectedItem.title,
        disciplineId: selectedItem.id,
        documents: null,
      })
    } else {
      navigation.push('DisciplineSelection', {
        discipline: selectedItem,
      })
    }
  }

  const renderListItem = ({ item }: { item: Discipline }): JSX.Element => (
    <DisciplineListItem item={item} onPress={() => handleNavigation(item)} hasBadge showProgress />
  )

  return (
    <Root>
      <StatusBar backgroundColor='blue' barStyle='dark-content' />
      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        <FlatList
          ListHeaderComponent={<Title title={discipline.title} description={childrenDescription(discipline, true)} />}
          data={disciplines}
          renderItem={renderListItem}
          keyExtractor={({ id }) => id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </ServerResponseHandler>
    </Root>
  )
}

export default DisciplineSelectionScreen
