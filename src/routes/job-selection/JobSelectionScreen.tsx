import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useLayoutEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import Button from '../../components/Button'
import Header from '../../components/Header'
import RouteWrapper from '../../components/RouteWrapper'
import { ContentSecondary } from '../../components/text/Content'
import { Heading } from '../../components/text/Heading'
import { BUTTONS_THEME } from '../../constants/data'
import useStorage, { useStorageCache } from '../../hooks/useStorage'
import { StandardJob } from '../../models/Job'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels } from '../../services/helpers'
import { pushSelectedJob, removeSelectedJob } from '../../services/storageUtils'
import JobSelection from './JobSelection'

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

type JobSelectionScreenProps = {
  route: RouteProp<RoutesParams, 'JobSelection'>
  navigation: StackNavigationProp<RoutesParams, 'JobSelection'>
}

const JobSelectionScreen = ({ navigation, route }: JobSelectionScreenProps): JSX.Element => {
  const { initialSelection } = route.params
  const storageCache = useStorageCache()
  const [selectedJobs, setSelectedJobs] = useStorage('selectedJobs')
  const [queryTerm, setQueryTerm] = useState<string>('')
  const theme = useTheme()

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: !initialSelection })
  })

  const navigateToHomeScreen = async () => {
    if (selectedJobs === null) {
      await setSelectedJobs([])
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'BottomTabNavigator' }],
    })
  }

  const selectJob = async (job: StandardJob) => {
    await pushSelectedJob(storageCache, job.id)
  }

  const unselectJob = async (job: StandardJob) => {
    await removeSelectedJob(storageCache, job.id)
  }

  return (
    <RouteWrapper
      backgroundColor={initialSelection ? theme.colors.primary : theme.colors.background}
      lightStatusBarContent={initialSelection}
      shouldSetBottomInset>
      <ScrollView>
        {initialSelection && <Header />}

        <TextContainer>
          {initialSelection ? (
            <StyledText>{getLabels().scopeSelection.welcome}</StyledText>
          ) : (
            <Heading centered>{getLabels().manageJobs.addJob}</Heading>
          )}
          <StyledText>{getLabels().scopeSelection.selectJob}</StyledText>
        </TextContainer>
        <JobSelection
          queryTerm={queryTerm}
          setQueryTerm={setQueryTerm}
          onSelectJob={selectJob}
          onUnselectJob={initialSelection ? unselectJob : undefined}
        />
        {initialSelection && (
          <ButtonContainer>
            <Button
              onPress={navigateToHomeScreen}
              label={
                selectedJobs && selectedJobs.length > 0
                  ? getLabels().scopeSelection.confirmSelection
                  : getLabels().scopeSelection.skipSelection
              }
              buttonTheme={BUTTONS_THEME.contained}
            />
          </ButtonContainer>
        )}
      </ScrollView>
    </RouteWrapper>
  )
}

export default JobSelectionScreen
