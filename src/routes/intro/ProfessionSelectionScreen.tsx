import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ComponentType } from 'react'
import { FlatList, StatusBar } from 'react-native'
import styled from 'styled-components/native'

import { CheckCircleIcon } from '../../../assets/images'
import Button from '../../components/Button'
import DisciplineListItem from '../../components/DisciplineListItem'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import Title from '../../components/Title'
import { BUTTONS_THEME } from '../../constants/data'
import { Discipline } from '../../constants/endpoints'
import labels from '../../constants/labels.json'
import { useLoadDisciplines } from '../../hooks/useLoadDisciplines'
import useReadSelectedProfessions from '../../hooks/useReadSelectedProfessions'
import { RoutesParams } from '../../navigation/NavigationTypes'
import AsyncStorage from '../../services/AsyncStorage'
import { childrenDescription } from '../../services/helpers'

const Root = styled.View`
  background-color: ${props => props.theme.colors.background};
  height: 100%;
`

const StyledList = styled(FlatList)`
  width: 100%;
` as ComponentType as new () => FlatList<Discipline>

const ButtonContainer = styled.View`
  padding-top: ${props => props.theme.spacings.md}
  margin: 0 auto 0;
`

interface ProfessionSelectionScreenProps {
  route: RouteProp<RoutesParams, 'ProfessionSelection'>
  navigation: StackNavigationProp<RoutesParams, 'ProfessionSelection'>
}

const ProfessionSelectionScreen = ({ route, navigation }: ProfessionSelectionScreenProps): JSX.Element => {
  const { discipline } = route.params
  const { data: disciplines, error, loading, refresh } = useLoadDisciplines(discipline)
  const { data: selectedProfessions, refresh: refreshSelectedProfessions } = useReadSelectedProfessions()

  const selectDiscipline = async (selectedItem: Discipline): Promise<void> => {
    if (selectedProfessions?.includes(selectedItem.id)) {
      await AsyncStorage.removeSelectedProfession(selectedItem.id).then(refreshSelectedProfessions)
    } else {
      await AsyncStorage.pushSelectedProfession(selectedItem.id).then(refreshSelectedProfessions)
    }
  }

  const Item = ({ item }: { item: Discipline }): JSX.Element => (
    <DisciplineListItem
      item={item}
      onPress={() => selectDiscipline(item)}
      hasBadge
      rightChildren={selectedProfessions?.includes(item.id) ? <CheckCircleIcon testID='check-icon' /> : <></>}
    />
  )

  const navigateToHomeScreen = () => {
    navigation.push('Home')
  }

  return (
    <Root>
      <StatusBar backgroundColor='blue' barStyle='dark-content' />
      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        <StyledList
          contentContainerStyle={{ flexGrow: 1 }}
          ListHeaderComponent={<Title title={discipline.title} description={childrenDescription(discipline)} />}
          ListFooterComponent={
            !selectedProfessions || selectedProfessions.length === 0 ? (
              <ButtonContainer>
                <Button
                  onPress={navigateToHomeScreen}
                  label={labels.intro.skipSelection}
                  buttonTheme={BUTTONS_THEME.contained}
                />
              </ButtonContainer>
            ) : (
              <></>
            )
          }
          ListFooterComponentStyle={{ flex: 1, justifyContent: 'flex-end' }}
          data={disciplines}
          renderItem={Item}
          keyExtractor={({ id }) => id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </ServerResponseHandler>
      {selectedProfessions && selectedProfessions.length > 0 && (
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
