import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'
import styled, { ThemeProvider } from 'styled-components/native'

import RouteWrapper from '../../components/RouteWrapper'
import { ContentSecondary } from '../../components/text/Content'
import { Heading } from '../../components/text/Heading'
import useAreaTheme from '../../hooks/useAreaTheme'
import useContentArea from '../../hooks/useContentArea'
import useStorage from '../../hooks/useStorage'
import Job, { StandardJob } from '../../models/Job'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels } from '../../services/helpers'
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

const HomeScreen = ({ navigation }: HomeScreenProps): ReactElement => {
  const [selectedJobs] = useStorage('selectedJobs')
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const contentArea = useContentArea(selectedJobs?.[currentIndex]?.token)
  const areaTheme = useAreaTheme(contentArea)
  const hasLightHeaderText = areaTheme.colors.textOnHeader !== areaTheme.colors.black
  const { welcome, welcomeContentArea } = getLabels().home
  const welcomeHeading = contentArea ? welcomeContentArea.replace('{}', contentArea.name) : welcome

  const navigateToManageSelection = (): void => {
    navigation.navigate('ManageSelection')
  }

  const navigateToJobSelection = () => {
    navigation.navigate('JobSelection', { initialSelection: false })
  }

  const navigateToJob = (job: Job): void => {
    navigation.navigate('UnitSelection', {
      job,
    })
  }

  const navigateToTrainingExerciseSelection = (job: StandardJob): void => {
    navigation.navigate('TrainingExerciseSelection', { job })
  }

  return (
    <ThemeProvider theme={areaTheme}>
      <RouteWrapper
        backgroundColor={areaTheme.colors.backgroundHeader}
        lightStatusBarContent={hasLightHeaderText}
        shouldSetTopInset
      >
        <Root contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
          <View>
            <HomeScreenHeader navigation={navigation} contentArea={contentArea} />
            <WelcomeHeading>{welcomeHeading}</WelcomeHeading>
            <WelcomeSubHeading>{getLabels().home.haveFun}</WelcomeSubHeading>
            <SelectedJobs
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              navigateToJob={navigateToJob}
              navigateToTrainingExerciseSelection={navigateToTrainingExerciseSelection}
              navigateToManageSelection={navigateToManageSelection}
              navigateToJobSelection={navigateToJobSelection}
            />
          </View>
          <HomeFooter />
        </Root>
      </RouteWrapper>
    </ThemeProvider>
  )
}

export default HomeScreen
