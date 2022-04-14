import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { FlatList, StatusBar } from 'react-native'
import styled from 'styled-components/native'

import { CheckCircleIconGreen } from '../../assets/images'
import Button from '../components/Button'
import DisciplineListItem from '../components/DisciplineListItem'
import ServerResponseHandler from '../components/ServerResponseHandler'
import Title from '../components/Title'
import { BUTTONS_THEME } from '../constants/data'
import { Discipline } from '../constants/endpoints'
import labels from '../constants/labels.json'
import { useLoadDisciplines } from '../hooks/useLoadDisciplines'
import useReadSelectedProfessions from '../hooks/useReadSelectedProfessions'
import { RoutesParams } from '../navigation/NavigationTypes'
import AsyncStorage from '../services/AsyncStorage'
import { childrenDescription } from '../services/helpers'

const Root = styled.View`
  margin: 0 ${props => props.theme.spacings.sm};
  height: 100%;
`

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
  const { data: disciplines, error, loading, refresh } = useLoadDisciplines(discipline)
  const { data: selectedProfessions, refresh: refreshSelectedProfessions } = useReadSelectedProfessions()
  const isSelectionMade = selectedProfessions && selectedProfessions.length > 0

  const selectDiscipline = async (selectedItem: Discipline): Promise<void> => {
    if (selectedProfessions?.some(profession => profession.id === selectedItem.id)) {
      await AsyncStorage.removeSelectedProfession(selectedItem).then(refreshSelectedProfessions)
    } else {
      await AsyncStorage.pushSelectedProfession(selectedItem).then(() => {
        if (!initialSelection) {
          navigation.navigate('ManageDisciplines')
        } else {
          refreshSelectedProfessions()
        }
      })
    }
  }

  const Item = ({ item }: { item: Discipline }): JSX.Element => {
    const isSelected = selectedProfessions?.some(profession => profession.id === item.id)
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
      await AsyncStorage.setSelectedProfessions([])
    }
    navigation.navigate('Home')
  }

  return (
    <Root>
      <StatusBar backgroundColor='blue' barStyle='dark-content' />
      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          ListHeaderComponent={<Title title={discipline.title} description={childrenDescription(discipline)} />}
          ListFooterComponent={
            !isSelectionMade ? (
              <ButtonContainer>
                <Button
                  onPress={navigateToHomeScreen}
                  label={labels.intro.skipSelection}
                  buttonTheme={BUTTONS_THEME.contained}
                />
              </ButtonContainer>
            ) : null
          }
          ListFooterComponentStyle={{ flex: 1, justifyContent: 'flex-end' }}
          data={disciplines}
          renderItem={Item}
          keyExtractor={({ id }) => id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </ServerResponseHandler>
      {isSelectionMade && !loading && (
        <ButtonContainer>
          <Button
            onPress={navigateToHomeScreen}
            label={labels.intro.confirmSelection}
            buttonTheme={BUTTONS_THEME.contained}
          />
        </ButtonContainer>
      )}
    </Root>
  )
}

export default ProfessionSelectionScreen
