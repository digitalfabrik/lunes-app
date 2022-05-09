import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useLayoutEffect } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import Button from '../../components/Button'
import DisciplineListItem from '../../components/DisciplineListItem'
import Header from '../../components/Header'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import { ContentSecondary } from '../../components/text/Content'
import { BUTTONS_THEME } from '../../constants/data'
import { Discipline } from '../../constants/endpoints'
import labels from '../../constants/labels.json'
import { useLoadDisciplines } from '../../hooks/useLoadDisciplines'
import useReadSelectedProfessions from '../../hooks/useReadSelectedProfessions'
import { RoutesParams } from '../../navigation/NavigationTypes'
import AsyncStorage from '../../services/AsyncStorage'

const DisciplineContainer = styled.View`
  margin: 0 ${props => props.theme.spacings.sm};
`

const ButtonContainer = styled.View`
  margin: ${props => props.theme.spacings.md} auto;
`

const StyledText = styled(ContentSecondary)`
  text-align: center;
`

const TextContainer = styled.View`
  margin-top: ${props => props.theme.spacings.xxl};
  margin-bottom: ${props => props.theme.spacings.lg};
`

interface IntroScreenProps {
  route: RouteProp<RoutesParams, 'ScopeSelection'>
  navigation: StackNavigationProp<RoutesParams, 'ScopeSelection'>
}

const ScopeSelectionScreen = ({ navigation, route }: IntroScreenProps): JSX.Element => {
  const { initialSelection } = route.params
  const { data: disciplines, error, loading, refresh } = useLoadDisciplines(null)
  const { data: selectedProfessions, refresh: refreshSelectedProfessions } = useReadSelectedProfessions()

  useFocusEffect(refreshSelectedProfessions)

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: !initialSelection })
  })

  const navigateToDiscipline = (item: Discipline): void => {
    navigation.push('ProfessionSelection', {
      discipline: item,
      initialSelection
    })
  }

  const navigateToHomeScreen = async () => {
    if (selectedProfessions === null) {
      await AsyncStorage.setSelectedProfessions([])
    }
    navigation.navigate('Home')
  }

  const disciplineItems = disciplines?.map(item => (
    <DisciplineListItem key={item.id} item={item} onPress={() => navigateToDiscipline(item)} hasBadge={false} />
  ))

  return (
    <ScrollView>
      {initialSelection && <Header />}
      <TextContainer>
        {initialSelection && (
          <>
            <StyledText>{labels.scopeSelection.welcome}</StyledText>
            <StyledText>{labels.scopeSelection.selectProfession}</StyledText>
          </>
        )}
      </TextContainer>
      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        <DisciplineContainer>{disciplineItems}</DisciplineContainer>
      </ServerResponseHandler>
      {initialSelection && (
        <ButtonContainer>
          <Button
            onPress={navigateToHomeScreen}
            label={
              selectedProfessions && selectedProfessions.length > 0
                ? labels.scopeSelection.confirmSelection
                : labels.scopeSelection.skipSelection
            }
            buttonTheme={BUTTONS_THEME.contained}
          />
        </ButtonContainer>
      )}
    </ScrollView>
  )
}

export default ScopeSelectionScreen
