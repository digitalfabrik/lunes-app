import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement } from 'react'
import * as Progress from 'react-native-progress'
import styled from 'styled-components/native'

import Button from '../../../components/Button'
import { BUTTONS_THEME, EXERCISES, NextExerciseData } from '../../../constants/data'
import theme from '../../../constants/theme'
import useLoadNextExercise from '../../../hooks/useLoadNextExercise'
import useLoadProgress from '../../../hooks/useLoadProgress'
import Job from '../../../models/Job'
import { childrenLabel, getLabels } from '../../../services/helpers'
import { NumberText, UnitText } from './JobCard'
import NextExerciseCard from './NextExerciseCard'

const ProgressContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacings.sm} 0 ${props => props.theme.spacings.xs};
`

type JobDetailsProps = {
  job: Job
  navigateToJob: (job: Job) => void
  navigateToNextExercise: (nextExerciseData: NextExerciseData) => void
}

const JobDetails = ({ job, navigateToJob, navigateToNextExercise }: JobDetailsProps): ReactElement | null => {
  const { data: progress } = useLoadProgress(job)
  const { data: nextExerciseData, refresh: refreshNextExercise } = useLoadNextExercise(job)

  const jobAlreadyStarted = progress !== 0
  const completedUnits = jobAlreadyStarted ? Math.floor((progress ?? 0) * job.numberOfUnits) : 0

  useFocusEffect(refreshNextExercise)

  if (!nextExerciseData) {
    return null
  }

  const { vocabularyItems, jobTitle, exerciseKey } = nextExerciseData

  return (
    <>
      <ProgressContainer>
        <Progress.Circle
          progress={completedUnits ? (progress ?? 0) : 0}
          size={50}
          indeterminate={false}
          color={theme.colors.progressIndicator}
          unfilledColor={theme.colors.disabled}
          borderWidth={0}
          thickness={6}
          testID='progress-circle'
        />

        <NumberText>
          {completedUnits}/{job.numberOfUnits}
        </NumberText>

        <UnitText>{completedUnits > 0 ? getLabels().home.progressDescription : childrenLabel(job)}</UnitText>
      </ProgressContainer>
      <NextExerciseCard
        thumbnail={vocabularyItems[0].images[0]}
        onPress={() => navigateToNextExercise(nextExerciseData)}
        heading={EXERCISES[exerciseKey].title}
        buttonLabel={nextExerciseData.exerciseKey === 0 ? getLabels().home.start : getLabels().home.continue}
        subheading={jobTitle}
      />
      <Button
        onPress={() => navigateToJob(job)}
        label={getLabels().home.viewUnits}
        buttonTheme={BUTTONS_THEME.outlined}
        fitToContentWidth
      />
    </>
  )
}

export default JobDetails
