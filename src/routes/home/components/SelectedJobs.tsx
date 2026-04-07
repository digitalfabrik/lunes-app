import React, { useState, ReactElement } from 'react'
import styled from 'styled-components/native'

import { AddCircleIcon, PenIcon } from '../../../../assets/images'
import Button from '../../../components/Button'
import PressableOpacity from '../../../components/PressableOpacity'
import { Heading } from '../../../components/text/Heading'
import { SubheadingPrimary } from '../../../components/text/Subheading'
import { BUTTONS_THEME } from '../../../constants/data'
import useStorage from '../../../hooks/useStorage'
import Job, { JobId, StandardJob } from '../../../models/Job'
import { getLabels } from '../../../services/helpers'
import JobCard from './JobCard'

const Box = styled.View``

const BoxHeading = styled.View`
  margin: 0 ${props => props.theme.spacings.sm};
  padding: 0 ${props => props.theme.spacings.sm};
  border-bottom-color: ${props => props.theme.colors.disabled};
  border-bottom-width: 1px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${props => props.theme.spacings.sm} ${props => props.theme.spacings.sm} ${props => props.theme.spacings.sm} 0;
`

const BoxFooter = styled.View`
  margin: 0 ${props => props.theme.spacings.sm};
  border-bottom-color: ${props => props.theme.colors.disabled};
  border-bottom-width: 1px;
`

const IconContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${props => props.theme.spacings.xs};
`

const Title = styled(Heading)`
  font-size: ${props => props.theme.fonts.largeFontSize};
  padding-right: ${props => props.theme.spacings.sm};
`

const JobCardWrapper = styled.View<{ isVisible: boolean }>`
  ${props => !props.isVisible && 'display: none;'}
`

const EmptyStateContainer = styled.View`
  align-items: center;
  padding: ${props => props.theme.spacings.lg} ${props => props.theme.spacings.sm};
`

const EmptyStateTitle = styled(SubheadingPrimary)`
  text-align: center;
  margin-bottom: ${props => props.theme.spacings.xs};
`

const EmptyStateSubtitle = styled.Text`
  color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${props => props.theme.fonts.defaultFontSize};
  text-align: center;
  margin-bottom: ${props => props.theme.spacings.md};
`

type SelectedJobsProps = {
  navigateToJob: (job: Job) => void
  navigateToTrainingExerciseSelection: (job: StandardJob) => void
  navigateToManageSelection: () => void
  navigateToJobSelection: () => void
}

const useAllJobs = (): JobId[] => {
  const [selectedJobs] = useStorage('selectedJobs')
  return selectedJobs?.map(id => ({ type: 'standard', id })) ?? []
}

const SelectedJobs = ({
  navigateToJob,
  navigateToTrainingExerciseSelection,
  navigateToManageSelection,
  navigateToJobSelection,
}: SelectedJobsProps): ReactElement | null => {
  const jobs = useAllJobs()
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const { emptyState } = getLabels().home

  const navigateToPrevious = (): void => setCurrentIndex(index => Math.max(0, index - 1))
  const navigateToNext = (): void => setCurrentIndex(index => Math.min(jobs.length - 1, index + 1))

  const jobsContent = (): ReactElement => {
    if (jobs.length === 0) {
      return (
        <EmptyStateContainer>
          <EmptyStateTitle>{emptyState.title}</EmptyStateTitle>
          <EmptyStateSubtitle>{emptyState.subtitle}</EmptyStateSubtitle>
          <Button
            onPress={navigateToJobSelection}
            label={getLabels().manageJobs.addJob}
            buttonTheme={BUTTONS_THEME.contained}
          />
        </EmptyStateContainer>
      )
    }
    return (
      <>
        {jobs.map((job, index) => (
          <JobCardWrapper key={JSON.stringify(job)} isVisible={index === currentIndex}>
            <JobCard
              identifier={job}
              navigateToJob={navigateToJob}
              navigateToTrainingExerciseSelection={navigateToTrainingExerciseSelection}
              onPressLeft={jobs.length > 1 && index > 0 ? navigateToPrevious : undefined}
              onPressRight={jobs.length > 1 && index < jobs.length - 1 ? navigateToNext : undefined}
            />
          </JobCardWrapper>
        ))}
      </>
    )
  }

  return (
    <Box>
      <BoxHeading>
        <Title>
          {getLabels().home.jobs} [{jobs.length}]
        </Title>
        {jobs.length > 0 && (
          <IconContainer>
            <PressableOpacity
              onPress={navigateToManageSelection}
              testID='edit-professions-button'
              accessibilityLabel={getLabels().home.editProfessions}
            >
              <PenIcon />
            </PressableOpacity>
            <PressableOpacity
              onPress={navigateToJobSelection}
              testID='add-profession-button'
              accessibilityLabel={getLabels().home.addProfession}
            >
              <AddCircleIcon />
            </PressableOpacity>
          </IconContainer>
        )}
      </BoxHeading>

      {jobsContent()}

      <BoxFooter />
    </Box>
  )
}

export default SelectedJobs
