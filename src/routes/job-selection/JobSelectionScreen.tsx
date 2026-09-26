import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useCallback, useLayoutEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import Button from '../../components/Button'
import Header from '../../components/Header'
import PressableOpacity from '../../components/PressableOpacity'
import RouteWrapper from '../../components/RouteWrapper'
import { ContentSecondary, ContentTextBold } from '../../components/text/Content'
import { Heading } from '../../components/text/Heading'
import { BUTTONS_THEME } from '../../constants/data'
import useContentArea from '../../hooks/useContentArea'
import useStorage, { useStorageCache } from '../../hooks/useStorage'
import { StandardJob } from '../../models/Job'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { resetToHome } from '../../navigation/navigationHelpers'
import { getLabels } from '../../services/helpers'
import { pushSelectedJob, removeSelectedJob } from '../../services/storageUtils'
import JobSelection from './JobSelection'

const matchesJobScope = (token: string | undefined, jobScope: RoutesParams['JobSelection']['jobScope']): boolean => {
  if (jobScope?.type === 'contentArea') {
    return token === jobScope.token
  }
  if (jobScope?.type === 'lunesOnly') {
    return !token
  }
  return true
}

const StyledRouteWrapper = styled(RouteWrapper)`
  flex: 1;
`

const TextContainer = styled.View`
  margin-top: ${props => props.theme.spacings.xxl};
  margin-bottom: ${props => props.theme.spacings.lg};
  gap: ${props => props.theme.spacings.xs};
`

const StyledText = styled(ContentSecondary)`
  text-align: center;
`

const ButtonContainer = styled(SafeAreaView)`
  position: absolute;
  bottom: ${props => props.theme.spacings.md};
  width: 100%;
  align-items: center;
`

const GoToLunesJobsLink = styled(ContentTextBold)`
  text-align: center;
  margin: ${props => props.theme.spacings.md} 0;
`

type JobSelectionScreenProps = {
  route: RouteProp<RoutesParams, 'JobSelection'>
  navigation: StackNavigationProp<RoutesParams, 'JobSelection'>
}

const JobSelectionScreen = ({ navigation, route }: JobSelectionScreenProps): ReactElement => {
  const { initialSelection, jobScope } = route.params
  const storageCache = useStorageCache()
  const [selectedJobs, setSelectedJobs] = useStorage('selectedJobs')
  const [queryTerm, setQueryTerm] = useState<string>('')
  const theme = useTheme()

  // Lunes jobs picked via the Lunes-only list stay visible in the content area list, so the selection is complete there
  const isJobInScope = useCallback(
    (job: StandardJob): boolean =>
      matchesJobScope(job.token, jobScope) ||
      (jobScope?.type === 'contentArea' && !!selectedJobs?.some(selectedJob => selectedJob.id === job.id.id)),
    [jobScope, selectedJobs],
  )

  const contentAreaScope = jobScope?.type === 'contentArea' ? jobScope : undefined
  const isContentArea = contentAreaScope !== undefined
  const contentArea = useContentArea(contentAreaScope?.token)
  const headline = contentArea
    ? getLabels().scopeSelection.contentAreaTitle.replace('{}', contentArea.name)
    : getLabels().manageJobs.addJob
  const subtitle = isContentArea ? getLabels().scopeSelection.contentAreaSubtitle : getLabels().scopeSelection.selectJob
  const hasSelectedJobs = !!selectedJobs && selectedJobs.length > 0

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: !initialSelection })
  })

  const navigateToHomeScreen = async () => {
    if (selectedJobs === null) {
      await setSelectedJobs([])
    }
    resetToHome(navigation)
  }

  const selectJob = async (job: StandardJob) => {
    await pushSelectedJob(storageCache, job)
  }

  const unselectJob = async (job: StandardJob) => {
    await removeSelectedJob(storageCache, job.id)
  }

  const navigateToLunesJobs = (): void => {
    navigation.push('JobSelection', { initialSelection: false, jobScope: { type: 'lunesOnly' } })
  }

  return (
    <StyledRouteWrapper
      backgroundColor={initialSelection ? theme.colors.primary : theme.colors.background}
      lightStatusBarContent={initialSelection}
      shouldSetBottomInset
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} keyboardShouldPersistTaps='handled'>
        {initialSelection && <Header />}

        <TextContainer>
          {initialSelection ? (
            <StyledText>{getLabels().scopeSelection.welcome}</StyledText>
          ) : (
            <Heading centered>{headline}</Heading>
          )}
          <StyledText>{subtitle}</StyledText>
        </TextContainer>
        <JobSelection
          queryTerm={queryTerm}
          setQueryTerm={setQueryTerm}
          onSelectJob={selectJob}
          onUnselectJob={initialSelection || isContentArea ? unselectJob : undefined}
          isJobInScope={isJobInScope}
        />
        {isContentArea && (
          <PressableOpacity
            onPress={navigateToLunesJobs}
            testID='go-to-lunes-jobs-button'
            style={{ alignSelf: 'center' }}
            accessibilityLabel={getLabels().scopeSelection.goToLunesJobs.replace(/\s*→\s*$/, '')}
          >
            <GoToLunesJobsLink>{getLabels().scopeSelection.goToLunesJobs}</GoToLunesJobsLink>
          </PressableOpacity>
        )}
      </ScrollView>
      {(initialSelection || (isContentArea && hasSelectedJobs)) && (
        <ButtonContainer>
          <Button
            onPress={navigateToHomeScreen}
            label={
              hasSelectedJobs ? getLabels().scopeSelection.confirmSelection : getLabels().scopeSelection.skipSelection
            }
            buttonTheme={BUTTONS_THEME.contained}
          />
        </ButtonContainer>
      )}
    </StyledRouteWrapper>
  )
}

export default JobSelectionScreen
