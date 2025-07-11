import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useLayoutEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import Button from '../../components/Button'
import Header from '../../components/Header'
import RouteWrapper from '../../components/RouteWrapper'
import SafeBottomPadding from '../../components/SafeBottomPadding'
import { ContentSecondary } from '../../components/text/Content'
import { Heading } from '../../components/text/Heading'
import { BUTTONS_THEME } from '../../constants/data'
import { Discipline } from '../../constants/endpoints'
import useStorage from '../../hooks/useStorage'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels } from '../../services/helpers'
import ScopeSelection from './ScopeSelection'

const TextContainer = styled.View`
  margin-top: ${props => props.theme.spacings.xxl};
  margin-bottom: ${props => props.theme.spacings.lg};
`

const StyledText = styled(ContentSecondary)`
  text-align: center;
`

const ButtonContainer = styled.View`
  margin: ${props => props.theme.spacings.md} auto;
`

type IntroScreenProps = {
  route: RouteProp<RoutesParams, 'ScopeSelection'>
  navigation: StackNavigationProp<RoutesParams, 'ScopeSelection'>
}

const ScopeSelectionScreen = ({ navigation, route }: IntroScreenProps): JSX.Element => {
  const { initialSelection } = route.params
  const [selectedProfessions, setSelectedProfessions] = useStorage('selectedProfessions')
  const [queryTerm, setQueryTerm] = useState<string>('')
  const theme = useTheme()

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: !initialSelection })
  })

  const navigateToDiscipline = (item: Discipline): void => {
    navigation.navigate('ProfessionSelection', {
      discipline: item,
      initialSelection,
    })
  }

  const navigateToHomeScreen = async () => {
    if (selectedProfessions === null) {
      await setSelectedProfessions([])
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'BottomTabNavigator' }],
    })
  }

  return (
    <RouteWrapper
      backgroundColor={initialSelection ? theme.colors.primary : theme.colors.background}
      lightStatusBarContent={initialSelection}>
      <ScrollView>
        {initialSelection && <Header />}

        <TextContainer>
          {initialSelection ? (
            <StyledText>{getLabels().scopeSelection.welcome}</StyledText>
          ) : (
            <Heading centered>{getLabels().manageSelection.addProfession}</Heading>
          )}
          <StyledText>{getLabels().scopeSelection.selectProfession}</StyledText>
        </TextContainer>
        <ScopeSelection
          queryTerm={queryTerm}
          setQueryTerm={setQueryTerm}
          navigateToDiscipline={navigateToDiscipline}
          selectedProfessions={selectedProfessions}
        />
        {initialSelection && (
          <ButtonContainer>
            <Button
              onPress={navigateToHomeScreen}
              label={
                selectedProfessions && selectedProfessions.length > 0
                  ? getLabels().scopeSelection.confirmSelection
                  : getLabels().scopeSelection.skipSelection
              }
              buttonTheme={BUTTONS_THEME.contained}
            />
          </ButtonContainer>
        )}
        <SafeBottomPadding />
      </ScrollView>
    </RouteWrapper>
  )
}

export default ScopeSelectionScreen
