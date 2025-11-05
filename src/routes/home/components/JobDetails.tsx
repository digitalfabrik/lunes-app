import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement } from 'react'
import * as Progress from 'react-native-progress'
import styled from 'styled-components/native'

import Button from '../../../components/Button'
import { BUTTONS_THEME, EXERCISES, NextExerciseData } from '../../../constants/data'
import { Discipline } from '../../../constants/endpoints'
import theme from '../../../constants/theme'
import useLoadNextExercise from '../../../hooks/useLoadNextExercise'
import useProgress from '../../../hooks/useProgress'
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
  discipline: Discipline
  navigateToDiscipline: (discipline: Discipline) => void
  navigateToNextExercise: (nextExerciseData: NextExerciseData) => void
}

const JobDetails = ({
  discipline,
  navigateToDiscipline,
  navigateToNextExercise,
}: JobDetailsProps): ReactElement | null => {
  const progress = useProgress(discipline)
  const { data: nextExerciseData, refresh: refreshNextExercise } = useLoadNextExercise(discipline)

  const disciplineAlreadyStarted = progress !== 0
  const completedDisciplines =
    disciplineAlreadyStarted && discipline.leafDisciplines
      ? Math.floor(progress * discipline.leafDisciplines.length)
      : 0

  useFocusEffect(refreshNextExercise)

  if (!nextExerciseData) {
    return null
  }

  const { vocabularyItems, title, exerciseKey } = nextExerciseData

  return (
    <>
      <ProgressContainer>
        <Progress.Circle
          progress={completedDisciplines ? progress : 0}
          size={50}
          indeterminate={false}
          color={theme.colors.progressIndicator}
          unfilledColor={theme.colors.disabled}
          borderWidth={0}
          thickness={6}
          testID='progress-circle'
        />
        {discipline.leafDisciplines && (
          <NumberText>
            {completedDisciplines}/{discipline.leafDisciplines.length}
          </NumberText>
        )}
        <UnitText>
          {completedDisciplines > 0 ? getLabels().home.progressDescription : childrenLabel(discipline)}
        </UnitText>
      </ProgressContainer>
      <NextExerciseCard
        thumbnail={vocabularyItems[0].images[0]}
        onPress={() => navigateToNextExercise(nextExerciseData)}
        heading={EXERCISES[exerciseKey].title}
        buttonLabel={nextExerciseData.exerciseKey === 0 ? getLabels().home.start : getLabels().home.continue}
        subheading={title}
      />
      <Button
        onPress={() => navigateToDiscipline(discipline)}
        label={getLabels().home.viewDisciplines}
        buttonTheme={BUTTONS_THEME.outlined}
        fitToContentWidth
      />
    </>
  )
}

export default JobDetails
