import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement } from 'react'
import * as Progress from 'react-native-progress'
import styled from 'styled-components/native'

import Button from '../../../components/Button'
import { BUTTONS_THEME, EXERCISES, NextExerciseData } from '../../../constants/data'
import { Discipline } from '../../../constants/endpoints'
import theme from '../../../constants/theme'
import useLoadNextExercise from '../../../hooks/useLoadNextExercise'
import useReadProgress from '../../../hooks/useReadProgress'
import { childrenLabel, getLabels } from '../../../services/helpers'
import { ButtonContainer, NumberText, UnitText } from './DisciplineCard'
import NextExerciseCard from './NextExerciseCard'

const ProgressContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacings.sm} 0 ${props => props.theme.spacings.xs};
`

interface ProfessionDetailsProps {
  discipline: Discipline
  navigateToDiscipline: (discipline: Discipline) => void
  navigateToNextExercise: (nextExerciseData: NextExerciseData) => void
}

const ProfessionDetails = ({
  discipline,
  navigateToDiscipline,
  navigateToNextExercise,
}: ProfessionDetailsProps): ReactElement | null => {
  const { data: progress, refresh: refreshProgress } = useReadProgress(discipline)
  const { data: nextExerciseData, refresh: refreshNextExercise } = useLoadNextExercise(discipline)

  const disciplineAlreadyStarted = progress !== null && progress !== 0
  const completedDisciplines =
    disciplineAlreadyStarted && discipline.leafDisciplines
      ? Math.floor(progress * discipline.leafDisciplines.length)
      : 0

  useFocusEffect(refreshProgress)
  useFocusEffect(refreshNextExercise)

  if (!nextExerciseData) {
    return null
  }

  const { vocabularyItems, title, exerciseKey } = nextExerciseData

  return (
    <>
      <ProgressContainer>
        <Progress.Circle
          progress={completedDisciplines ? progress ?? 0 : 0}
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
          {completedDisciplines > 0 ? getLabels().home.progressDescription : childrenLabel(discipline, true)}
        </UnitText>
      </ProgressContainer>
      <NextExerciseCard
        thumbnail={vocabularyItems[0].images[0].image}
        onPress={() => navigateToNextExercise(nextExerciseData)}
        heading={EXERCISES[exerciseKey].title}
        buttonLabel={nextExerciseData.exerciseKey === 0 ? getLabels().home.start : getLabels().home.continue}
        subheading={title}
      />
      <ButtonContainer>
        <Button
          onPress={() => navigateToDiscipline(discipline)}
          label={getLabels().home.viewDisciplines}
          buttonTheme={BUTTONS_THEME.outlined}
        />
      </ButtonContainer>
    </>
  )
}

export default ProfessionDetails
