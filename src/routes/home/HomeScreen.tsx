import { CommonActions, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import HeaderWithMenu from '../../components/HeaderWithMenu'
import { ContentSecondary } from '../../components/text/Content'
import { Heading } from '../../components/text/Heading'
import { EXERCISES } from '../../constants/data'
import { Discipline, Document } from '../../constants/endpoints'
import labels from '../../constants/labels.json'
import useReadCustomDisciplines from '../../hooks/useReadCustomDisciplines'
import useReadSelectedProfessions from '../../hooks/useReadSelectedProfessions'
import { RoutesParams } from '../../navigation/NavigationTypes'
import AddCustomDisciplineCard from './components/AddCustomDiscipline'
import CustomDiscipline from './components/CustomDiscipline'
import DisciplineCard from './components/DisciplineCard'
import HomeFooter from './components/HomeFooter'

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

interface HomeScreenProps {
  navigation: StackNavigationProp<RoutesParams, 'Home'>
}

const HomeScreen = ({ navigation }: HomeScreenProps): JSX.Element => {
  const { data: customDisciplines, refresh: refreshCustomDisciplines } = useReadCustomDisciplines()
  const { data: selectedProfessions, refresh: refreshSelectedProfessions } = useReadSelectedProfessions()
  const isCustomDisciplineEmpty = !customDisciplines || customDisciplines.length <= 0

  useFocusEffect(
    React.useCallback(() => {
      refreshCustomDisciplines()
      refreshSelectedProfessions()
    }, [refreshCustomDisciplines, refreshSelectedProfessions])
  )

  const navigateToImprintScreen = (): void => {
    navigation.navigate('Imprint')
  }

  const navigateToDiscipline = (item: Discipline): void => {
    navigation.navigate('DisciplineSelection', {
      discipline: item
    })
  }

  const navigateToNextExercise = (
    disciplineId: number,
    exerciseKey: number,
    disciplineTitle: string,
    documents: Document[]
  ): void => {
    navigation.navigate(EXERCISES[exerciseKey].screen, {
      disciplineId,
      disciplineTitle,
      documents,
      closeExerciseAction: CommonActions.navigate('Home')
    })
  }

  const navigateToAddCustomDisciplineScreen = (): void => {
    navigation.navigate('AddCustomDiscipline')
  }

  const customDisciplineItems = customDisciplines?.map(customDiscipline => (
    <CustomDiscipline key={customDiscipline} apiKey={customDiscipline} navigation={navigation} />
  ))

  const selectedProfessionItems = selectedProfessions?.map(profession => (
    <DisciplineCard
      key={profession.id}
      discipline={profession}
      showProgress
      onPress={navigateToDiscipline}
      navigateToNextExercise={navigateToNextExercise}
    />
  ))

  return (
    <Root contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
      <View>
        <HeaderWithMenu navigation={navigation} />

        <WelcomeHeading>{labels.home.welcome}</WelcomeHeading>
        <WelcomeSubHeading>{labels.home.haveFun}</WelcomeSubHeading>

        {selectedProfessionItems}

        {isCustomDisciplineEmpty ? (
          <AddCustomDisciplineCard navigate={navigateToAddCustomDisciplineScreen} />
        ) : (
          customDisciplineItems
        )}
      </View>
      <HomeFooter navigateToImprint={navigateToImprintScreen} />
    </Root>
  )
}

export default HomeScreen
