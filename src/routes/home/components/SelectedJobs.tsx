import React, { useRef, ReactElement } from 'react'
import { FlatList } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { AddCircleIcon, PenIcon } from '../../../../assets/images'
import PressableOpacity from '../../../components/PressableOpacity'
import { Heading } from '../../../components/text/Heading'
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
  const listRef = useRef<FlatList>(null)

  return (
    <Box>
      <BoxHeading>
        <Title>
          {getLabels().home.jobs} [{jobs.length}]
        </Title>
        <IconContainer>
          <PressableOpacity onPress={navigateToManageSelection} testID='edit-professions-button'>
            <PenIcon />
          </PressableOpacity>
          <PressableOpacity onPress={navigateToJobSelection} testID='add-profession-button'>
            <AddCircleIcon />
          </PressableOpacity>
        </IconContainer>
      </BoxHeading>

      {jobs.length === 1 ? (
        <JobCard
          identifier={jobs[0]}
          navigateToJob={navigateToJob}
          navigateToTrainingExerciseSelection={navigateToTrainingExerciseSelection}
        />
      ) : (
        <FlatList
          horizontal
          ref={listRef}
          // Workaround for https://github.com/facebook/react-native/issues/27504
          onEndReached={() => listRef.current?.scrollToEnd()}
          data={jobs}
          keyExtractor={item => JSON.stringify(item)}
          renderItem={({ item }) => (
            <JobCard
              identifier={item}
              width={wp('75%')}
              navigateToJob={navigateToJob}
              navigateToTrainingExerciseSelection={navigateToTrainingExerciseSelection}
            />
          )}
        />
      )}

      <BoxFooter />
    </Box>
  )
}

export default SelectedJobs
