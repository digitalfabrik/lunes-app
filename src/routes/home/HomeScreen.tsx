import { useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { ContentSecondary } from '../../components/text/Content'
import { Heading } from '../../components/text/Heading'
import labels from '../../constants/labels.json'
import useReadCustomDisciplines from '../../hooks/useReadCustomDisciplines'
import useReadSelectedProfessions from '../../hooks/useReadSelectedProfessions'
import { RoutesParams } from '../../navigation/NavigationTypes'
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

interface HomeScreenProps {
  navigation: StackNavigationProp<RoutesParams, 'Home'>
}

const HomeScreen = ({ navigation }: HomeScreenProps): JSX.Element => {
  const { data: customDisciplines, refresh: refreshCustomDisciplines } = useReadCustomDisciplines()
  const { data: selectedProfessions, refresh: refreshSelectedProfessions } = useReadSelectedProfessions()
  const isCustomDisciplineEmpty = !customDisciplines || customDisciplines.length <= 0

  useFocusEffect(refreshCustomDisciplines)
  useFocusEffect(refreshSelectedProfessions)

  const navigateToImprintScreen = (): void => {
    navigation.navigate('Imprint')
  }

  const navigateToAddCustomDisciplineScreen = (): void => {
    navigation.navigate('AddCustomDiscipline')
  }

  const customDisciplineItems = customDisciplines?.map(customDiscipline => (
    <DisciplineCard
      key={customDiscipline}
      identifier={{ apiKey: customDiscipline }}
      refresh={refreshCustomDisciplines}
    />
  ))

  const selectedProfessionItems = selectedProfessions?.map(profession => (
    <DisciplineCard key={profession} identifier={{ disciplineId: profession }} />
  ))

  return (
    <Root contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
      <View>
        <HomeScreenHeader navigation={navigation} />

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
