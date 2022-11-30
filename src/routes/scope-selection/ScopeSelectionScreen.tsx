import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useLayoutEffect } from 'react'
import styled, { useTheme } from 'styled-components/native'

import Button from '../../components/Button'
import DisciplineListItem from '../../components/DisciplineListItem'
import Header from '../../components/Header'
import RouteWrapper from '../../components/RouteWrapper'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import { ContentSecondary } from '../../components/text/Content'
import { Heading } from '../../components/text/Heading'
import { BUTTONS_THEME } from '../../constants/data'
import { Discipline } from '../../constants/endpoints'
import { useLoadDisciplines } from '../../hooks/useLoadDisciplines'
import useReadSelectedProfessions from '../../hooks/useReadSelectedProfessions'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { setSelectedProfessions } from '../../services/AsyncStorage'
import { getLabels } from '../../services/helpers'

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

const StyledScrollView = styled.ScrollView`
  background-color: ${props => props.theme.colors.background};
`

type IntroScreenProps = {
  route: RouteProp<RoutesParams, 'ScopeSelection'>
  navigation: StackNavigationProp<RoutesParams, 'ScopeSelection'>
}

const ScopeSelectionScreen = ({ navigation, route }: IntroScreenProps): JSX.Element => {
  const { initialSelection } = route.params
  const { data: disciplines, error, loading, refresh } = useLoadDisciplines({ parent: null })
  const { data: selectedProfessions, refresh: refreshSelectedProfessions } = useReadSelectedProfessions()
  const theme = useTheme()

  useFocusEffect(refreshSelectedProfessions)

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

  const disciplineItems = disciplines?.map(item => (
    <DisciplineListItem key={item.id} item={item} onPress={() => navigateToDiscipline(item)} hasBadge={false} />
  ))

  return (
    <RouteWrapper
      backgroundColor={initialSelection ? theme.colors.primary : theme.colors.background}
      lightStatusBarContent={initialSelection}>
      <StyledScrollView>
        {initialSelection && <Header />}

        <TextContainer>
          {initialSelection ? (
            <StyledText>{getLabels().scopeSelection.welcome}</StyledText>
          ) : (
            <Heading centered>{getLabels().manageSelection.addProfession}</Heading>
          )}
          <StyledText>{getLabels().scopeSelection.selectProfession}</StyledText>
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
                  ? getLabels().scopeSelection.confirmSelection
                  : getLabels().scopeSelection.skipSelection
              }
              buttonTheme={BUTTONS_THEME.contained}
            />
          </ButtonContainer>
        )}
      </StyledScrollView>
    </RouteWrapper>
  )
}

export default ScopeSelectionScreen
