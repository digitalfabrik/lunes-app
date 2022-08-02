import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement } from 'react'
import * as Progress from 'react-native-progress'
import styled from 'styled-components/native'

import Button from '../../../components/Button'
import { BUTTONS_THEME, EXERCISES, NextExerciseData } from '../../../constants/data'
import { Discipline } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import theme from '../../../constants/theme'
import useLoadNextExercise from '../../../hooks/useLoadNextExercise'
import useReadProgress from '../../../hooks/useReadProgress'
import { childrenLabel } from '../../../services/helpers'
import { ButtonContainer, NumberText, UnitText } from './DisciplineCard'
import NextExerciseCard from './NextExerciseCard'

const ProgressContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacings.sm} 0 ${props => props.theme.spacings.xs};
`

interface PropsType {
  discipline: Discipline
  navigateToDiscipline: (discipline: Discipline) => void
  navigateToNextExercise: (nextExerciseData: NextExerciseData) => void
}

const ProfessionDetails = ({
  discipline,
  navigateToDiscipline,
  navigateToNextExercise,
}: PropsType): ReactElement | null => {
  const { data: progress, refresh: refreshProgress } = useReadProgress(discipline)
  const { data: nextExerciseData, refresh: refreshNextExercise } = useLoadNextExercise(discipline)

  const moduleAlreadyStarted = progress !== null && progress !== 0
  const startedModules =
    moduleAlreadyStarted && discipline.leafDisciplines ? progress * discipline.leafDisciplines.length : 0
  const completedModules = Math.floor(startedModules)

  useFocusEffect(refreshProgress)
  useFocusEffect(refreshNextExercise)

  if (!nextExerciseData) {
    return null
  }

  const { documents, title, exerciseKey } = nextExerciseData

  return (
    <>
      <ProgressContainer>
        <Progress.Circle
          progress={completedModules ? progress ?? 0 : 0}
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
            {completedModules}/{discipline.leafDisciplines.length}
          </NumberText>
        )}
        <UnitText>{completedModules > 0 ? labels.home.progressDescription : childrenLabel(discipline, true)}</UnitText>
      </ProgressContainer>
      <NextExerciseCard
        thumbnail={documents[0].document_image[0].image}
        onPress={() => navigateToNextExercise(nextExerciseData)}
        heading={EXERCISES[exerciseKey].title}
        buttonLabel={startedModules > 0 ? labels.home.continue : labels.home.start}
        subheading={title}
      />
      <ButtonContainer>
        <Button
          onPress={() => navigateToDiscipline(discipline)}
          label={labels.home.viewModules}
          buttonTheme={BUTTONS_THEME.outlined}
        />
      </ButtonContainer>
    </>
  )
}

export default ProfessionDetails
