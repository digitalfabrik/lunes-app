import { CommonActions, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useContext } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import RouteWrapper from '../../components/RouteWrapper'
import { ContentSecondary } from '../../components/text/Content'
import { Heading } from '../../components/text/Heading'
import { EXERCISES, NextExerciseData } from '../../constants/data'
import { Discipline } from '../../constants/endpoints'
import useReadCustomDisciplines from '../../hooks/useReadCustomDisciplines'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { StorageContext } from '../../services/Storage'
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
  const storage = useContext(StorageContext)
  const { data: customDisciplines, refresh: refreshCustomDisciplines } = useReadCustomDisciplines()
  const { value: selectedProfessions } = storage.selectedProfessions
  const isCustomDisciplineEmpty = !customDisciplines || customDisciplines.length <= 0
  const theme = useTheme()

  useFocusEffect(refreshCustomDisciplines)

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

  const customDisciplineItems = customDisciplines?.map(customDiscipline => (
    <DisciplineCard
      key={customDiscipline}
      identifier={{ apiKey: customDiscipline }}
      refresh={refreshCustomDisciplines}
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
