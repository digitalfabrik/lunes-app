import { CommonActions } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import RouteWrapper from '../../components/RouteWrapper'
import { ContentSecondary } from '../../components/text/Content'
import { Heading } from '../../components/text/Heading'
import { EXERCISES, NextExerciseData } from '../../constants/data'
import { Discipline } from '../../constants/endpoints'
import useStorage from '../../hooks/useStorage'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels } from '../../services/helpers'
import AddCustomDisciplineCard from './components/AddCustomDiscipline'
import DisciplineCard from './components/DisciplineCard'
import HomeFooter from './components/HomeFooter'
import HomeScreenHeader from './components/HomeScreenHeader'

const Root = styled.ScrollView`
  background-color: ${props => props.theme.colors.background};
`

const WelcomeHeading = styled(Heading)`
  margin-top: ${props => props.theme.spacings.xxl};
  text-align: center;
`
const WelcomeSubHeading = styled(ContentSecondary)`
  margin-bottom: ${props => props.theme.spacings.sm};
  text-align: center;
`

type HomeScreenProps = {
  navigation: StackNavigationProp<RoutesParams, 'Home'>
}

const HomeScreen = ({ navigation }: HomeScreenProps): JSX.Element => {
  const [customDisciplines] = useStorage('customDisciplines')
  const [selectedProfessions] = useStorage('selectedProfessions')
  const isCustomDisciplineEmpty = customDisciplines.length <= 0
  const theme = useTheme()

  const navigateToAddCustomDisciplineScreen = (): void => {
    navigation.navigate('AddCustomDiscipline')
  }

  const navigateToDiscipline = (discipline: Discipline): void => {
    navigation.navigate('DisciplineSelection', {
      discipline,
    })
  }

  const navigateToNextExercise = (nextExerciseData: NextExerciseData) => {
    const { exerciseKey, disciplineId, title: disciplineTitle, vocabularyItems } = nextExerciseData
    navigation.navigate(EXERCISES[exerciseKey].screen, {
      contentType: 'standard',
      disciplineId,
      disciplineTitle,
      vocabularyItems,
      closeExerciseAction: CommonActions.navigate('Home'),
    })
  }

  const customDisciplineItems = customDisciplines.map(customDiscipline => (
    <DisciplineCard
      key={customDiscipline}
      identifier={{ apiKey: customDiscipline }}
      navigateToDiscipline={navigateToDiscipline}
    />
  ))

  const selectedProfessionItems = selectedProfessions?.map(profession => (
    <DisciplineCard
      key={profession}
      identifier={{ disciplineId: profession }}
      navigateToDiscipline={navigateToDiscipline}
      navigateToNextExercise={navigateToNextExercise}
    />
  ))

  return (
    <RouteWrapper backgroundColor={theme.colors.primary} lightStatusBarContent>
      <Root contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
        <View>
          <HomeScreenHeader navigation={navigation} />
          <WelcomeHeading>{getLabels().home.welcome}</WelcomeHeading>
          <WelcomeSubHeading>{getLabels().home.haveFun}</WelcomeSubHeading>
          {selectedProfessionItems}
          {isCustomDisciplineEmpty ? (
            <AddCustomDisciplineCard navigate={navigateToAddCustomDisciplineScreen} />
          ) : (
            customDisciplineItems
          )}
        </View>
        <HomeFooter />
      </Root>
    </RouteWrapper>
  )
}

export default HomeScreen
