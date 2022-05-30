import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useEffect, useState } from 'react'
import * as Progress from 'react-native-progress'
import styled from 'styled-components/native'

import Button from '../../../components/Button'
import { BUTTONS_THEME, EXERCISES } from '../../../constants/data'
import { Discipline, Document } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import theme from '../../../constants/theme'
import { loadDiscipline } from '../../../hooks/useLoadDiscipline'
import { loadDocuments } from '../../../hooks/useLoadDocuments'
import useReadNextExercise from '../../../hooks/useReadNextExercise'
import useReadProgress from '../../../hooks/useReadProgress'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { childrenLabel } from '../../../services/helpers'
import { reportError } from '../../../services/sentry'
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
}

const ProfessionDetails = ({ discipline }: PropsType): ReactElement => {
  const { data: nextExercise, refresh: refreshNextExercise } = useReadNextExercise(discipline)
  const { data: progress, refresh: refreshProgress } = useReadProgress(discipline)

  const moduleAlreadyStarted = progress !== null && progress !== 0
  const [documents, setDocuments] = useState<Document[] | null>(null)
  const [trainingSet, setTrainingSet] = useState<Discipline | null>(null)
  const navigation = useNavigation<StackNavigationProp<RoutesParams, 'Home'>>()

  const navigateToDiscipline = (): void => {
    navigation.navigate('DisciplineSelection', {
      discipline
    })
  }

  useFocusEffect(refreshProgress)
  useFocusEffect(refreshNextExercise)

  useEffect(() => {
    if (nextExercise) {
      loadDocuments({ disciplineId: nextExercise.disciplineId }).then(setDocuments).catch(reportError)
      loadDiscipline({
        disciplineId: nextExercise.disciplineId,
        needsTrainingSetEndpoint: discipline.needsTrainingSetEndpoint
      })
        .then(setTrainingSet)
        .catch(reportError)
    }
  }, [nextExercise])

  const navigate = () => {
    if (documents !== null && nextExercise !== null && trainingSet !== null) {
      navigation.navigate(EXERCISES[nextExercise.exerciseKey].screen, {
        disciplineId: nextExercise.disciplineId,
        disciplineTitle: trainingSet.title,
        documents,
        closeExerciseAction: CommonActions.navigate('Home')
      })
    }
  }

  return (
    <>
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
      {documents && documents.length > 0 && nextExercise && trainingSet && (
        <NextExerciseCard
          thumbnail={documents[0].document_image[0].image}
          onPress={navigate}
          heading={`${labels.home.level} ${nextExercise.exerciseKey}`}
          buttonLabel={labels.home.continue}
          subheading={trainingSet.title}
        />
      )}
      <ButtonContainer>
        <Button onPress={navigateToDiscipline} label={labels.home.checkModules} buttonTheme={BUTTONS_THEME.outlined} />
      </ButtonContainer>
    </>
  )
}

export default ProfessionDetails
