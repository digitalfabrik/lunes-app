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
import HomeFooter from './components/HomeFooter'
import HomeScreenHeader from './components/HomeScreenHeader'
import SelectedJobs from './components/SelectedJobs'

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
  const theme = useTheme()
  const [customDisciplines] = useStorage('customDisciplines')
  const hasNoCustomDisciplines = customDisciplines.length === 0

  const navigateToAddCustomDisciplineScreen = (): void => {
    navigation.navigate('AddCustomDiscipline')
  }

  const navigateToManageSelection = (): void => {
    navigation.navigate('ManageSelection')
  }

  const navigateToJobSelection = () => {
    navigation.navigate('JobSelection', { initialSelection: false })
  }

  const navigateToJob = (job: Discipline): void => {
    navigation.navigate('UnitSelection', {
      job,
    })
  }

  const navigateToNextExercise = (nextExerciseData: NextExerciseData) => {
    const { exerciseKey, unit, vocabularyItems } = nextExerciseData
    navigation.navigate(EXERCISES[exerciseKey].screen, {
      contentType: 'standard',
      unitId: unit.id,
      jobTitle: nextExerciseData.jobTitle,
      vocabularyItems,
      closeExerciseAction: CommonActions.navigate('Home'),
    })
  }

  return (
    <RouteWrapper backgroundColor={theme.colors.primary} lightStatusBarContent shouldSetTopInset>
      <Root contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
        <View>
          <HomeScreenHeader navigation={navigation} />
          <WelcomeHeading>{getLabels().home.welcome}</WelcomeHeading>
          <WelcomeSubHeading>{getLabels().home.haveFun}</WelcomeSubHeading>
          <SelectedJobs
            navigateToDiscipline={navigateToJob}
            navigateToNextExercise={navigateToNextExercise}
            navigateToManageSelection={navigateToManageSelection}
            navigateToJobSelection={navigateToJobSelection}
          />
          {hasNoCustomDisciplines && <AddCustomDisciplineCard navigate={navigateToAddCustomDisciplineScreen} />}
        </View>
        <HomeFooter />
      </Root>
    </RouteWrapper>
  )
}

export default HomeScreen
