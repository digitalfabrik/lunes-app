import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { CheckCircleIconGreen } from '../../assets/images'
import Button from '../components/Button'
import DisciplineListItem from '../components/DisciplineListItem'
import RouteWrapper from '../components/RouteWrapper'
import ServerResponseHandler from '../components/ServerResponseHandler'
import Title from '../components/Title'
import { BUTTONS_THEME } from '../constants/data'
import { Discipline } from '../constants/endpoints'
import { useLoadDisciplines } from '../hooks/useLoadDisciplines'
import useReadSelectedProfessions from '../hooks/useReadSelectedProfessions'
import { RoutesParams } from '../navigation/NavigationTypes'
import { setSelectedProfessions, pushSelectedProfession, removeSelectedProfession } from '../services/AsyncStorage'
import { getLabels, childrenDescription } from '../services/helpers'

const List = styled.FlatList`
  margin: 0 ${props => props.theme.spacings.sm};
  height: 100%;
` as unknown as typeof FlatList

const ButtonContainer = styled.View`
  padding: ${props => props.theme.spacings.md} 0;
  margin: 0 auto 0;
`
const IconContainer = styled.View`
  margin-right: ${props => props.theme.spacings.sm};
`
const Placeholder = styled.View`
  width: 24px;
  margin-right: ${props => props.theme.spacings.sm};
`

interface ProfessionSelectionScreenProps {
  route: RouteProp<RoutesParams, 'ProfessionSelection'>
  navigation: StackNavigationProp<RoutesParams, 'ProfessionSelection'>
}

const ProfessionSelectionScreen = ({ route, navigation }: ProfessionSelectionScreenProps): JSX.Element => {
  const { discipline, initialSelection } = route.params
  const { data: disciplines, error, loading, refresh } = useLoadDisciplines({ parent: discipline })
  const { data: selectedProfessions, refresh: refreshSelectedProfessions } = useReadSelectedProfessions()
  const isSelectionMade = selectedProfessions && selectedProfessions.length > 0

  const selectDiscipline = async (selectedItem: Discipline): Promise<void> => {
    if (selectedProfessions?.includes(selectedItem.id)) {
      await removeSelectedProfession(selectedItem.id).then(refreshSelectedProfessions)
    } else {
      await pushSelectedProfession(selectedItem.id).then(() => {
        if (initialSelection) {
          refreshSelectedProfessions()
        } else {
          navigation.navigate('ManageSelection')
        }
      })
    }
  }

  const renderListItem = ({ item }: { item: Discipline }): JSX.Element => {
    const isSelected = selectedProfessions?.includes(item.id)
    return (
      <DisciplineListItem
        item={item}
        onPress={() => selectDiscipline(item)}
        hasBadge
        disabled={!initialSelection && isSelected}
        rightChildren={
          initialSelection && isSelected ? (
            <IconContainer>
              <CheckCircleIconGreen testID='check-icon' />
            </IconContainer>
          ) : (
            <Placeholder />
          )
        }
      />
    )
  }

  const navigateToHomeScreen = async () => {
    if (!isSelectionMade) {
      await setSelectedProfessions([])
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'BottomTabNavigator' }],
    })
  }

  return (
    <RouteWrapper>
      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        <List
          contentContainerStyle={{ flexGrow: 1 }}
          ListHeaderComponent={<Title title={discipline.title} description={childrenDescription(discipline)} />}
          ListFooterComponent={
            !isSelectionMade ? (
              <ButtonContainer>
                <Button
                  onPress={navigateToHomeScreen}
                  label={getLabels().scopeSelection.skipSelection}
                  buttonTheme={BUTTONS_THEME.contained}
                />
              </ButtonContainer>
            ) : null
          }
          ListFooterComponentStyle={{ flex: 1, justifyContent: 'flex-end' }}
          data={disciplines}
          renderItem={renderListItem}
          keyExtractor={({ id }) => id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </ServerResponseHandler>
      {isSelectionMade && !loading && initialSelection && (
        <ButtonContainer>
          <Button
            onPress={navigateToHomeScreen}
            label={getLabels().scopeSelection.confirmSelection}
            buttonTheme={BUTTONS_THEME.contained}
          />
        </ButtonContainer>
      )}
    </RouteWrapper>
  )
}

export default ProfessionSelectionScreen
