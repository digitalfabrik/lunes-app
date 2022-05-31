import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useEffect, useState } from 'react'
import { Pressable } from 'react-native'
import * as Progress from 'react-native-progress'
import styled from 'styled-components/native'

import Button from '../../../components/Button'
import { BUTTONS_THEME, EXERCISES } from '../../../constants/data'
import { Discipline, Document } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import theme from '../../../constants/theme'
import { loadDocuments } from '../../../hooks/useLoadDocuments'
import useReadNextExercise from '../../../hooks/useReadNextExercise'
import useReadProgress from '../../../hooks/useReadProgress'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { childrenLabel } from '../../../services/helpers'
import { reportError } from '../../../services/sentry'
import { ButtonContainer, NumberText, UnitText } from './DisciplineCard'

const ProgressContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacings.sm} 0 ${props => props.theme.spacings.xs};
`

interface PropsType {
  discipline: Discipline
}

const ProfessionDetails = ({ discipline }: PropsType): ReactElement => {
  const { data: nextExercise, refresh: refreshNextExercise } = useReadNextExercise(discipline)
  const { data: progress, refresh: refreshProgress } = useReadProgress(discipline)

  const moduleAlreadyStarted = progress !== null && progress !== 0
  const [documents, setDocuments] = useState<Document[] | null>(null)
  const navigation = useNavigation<StackNavigationProp<RoutesParams, 'Home'>>()

  useFocusEffect(refreshProgress)
  useFocusEffect(refreshNextExercise)

  useEffect(() => {
    if (nextExercise) {
      loadDocuments({ disciplineId: nextExercise.disciplineId }).then(setDocuments).catch(reportError)
    }
  }, [nextExercise])

  const navigate = () => {
    if (documents !== null && nextExercise !== null) {
      navigation.navigate(EXERCISES[nextExercise.exerciseKey].screen, {
        disciplineId: nextExercise.disciplineId,
        disciplineTitle: '', // TODO set discipline title correct LUN-320
        documents,
        closeExerciseAction: CommonActions.navigate('Home')
      })
    }
  }

  const navigateToDisciplines = () => navigation.navigate('DisciplineSelection', { discipline }) // TODO remove in LUN-328

  return (
    <Pressable onPress={navigateToDisciplines}>
      <ProgressContainer>
        <Progress.Circle
          progress={progress ?? 0}
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
            {moduleAlreadyStarted && `${Math.floor(progress * discipline.leafDisciplines.length)}/`}
            {discipline.leafDisciplines.length}
          </NumberText>
        )}
        <UnitText>{moduleAlreadyStarted ? labels.home.progressDescription : childrenLabel(discipline)}</UnitText>
      </ProgressContainer>
      <ButtonContainer>
        <Button
          onPress={navigate}
          label={moduleAlreadyStarted ? labels.home.continue : labels.home.start}
          buttonTheme={BUTTONS_THEME.outlined}
          disabled={documents === null || nextExercise === null}
        />
      </ButtonContainer>
    </Pressable>
  )
}

export default ProfessionDetails
