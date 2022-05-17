import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement, useEffect, useState } from 'react'
import * as Progress from 'react-native-progress'
import styled from 'styled-components/native'

import Button from '../../../components/Button'
import { ContentSecondary } from '../../../components/text/Content'
import { Subheading } from '../../../components/text/Subheading'
import { BUTTONS_THEME } from '../../../constants/data'
import { Discipline, Document } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import theme from '../../../constants/theme'
import { useLoadDiscipline } from '../../../hooks/useLoadDiscipline'
import { loadDocuments } from '../../../hooks/useLoadDocuments'
import useReadNextExercise from '../../../hooks/useReadNextExercise'
import useReadProgress from '../../../hooks/useReadProgress'
import { childrenLabel } from '../../../services/helpers'
import { reportError } from '../../../services/sentry'
import Card from './Card'
import NextExerciseCard from './NextExerciseCard'

const ProgressContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacings.sm} 0 ${props => props.theme.spacings.xs};
`

const NumberText = styled(Subheading)`
  font-size: ${props => props.theme.fonts.headingFontSize};
  padding: ${props => props.theme.spacings.xs};
`

const UnitText = styled(ContentSecondary)`
  font-size: ${props => props.theme.fonts.headingFontSize};
`

const ButtonContainer = styled.View`
  margin: ${props => props.theme.spacings.sm} auto;
`

interface PropsType {
  disciplineId: number
  onPress: (profession: Discipline) => void
  navigateToNextExercise: (
    disciplineId: number,
    exerciseKey: number,
    disciplineTitle: string,
    documents: Document[]
  ) => void
}

// TODO fix tests

const DisciplineCard = (props: PropsType): ReactElement => {
  const { disciplineId, onPress, navigateToNextExercise } = props
  const { data: discipline } = useLoadDiscipline(disciplineId)
  const { data: nextExercise, refresh: refreshNextExercise } = useReadNextExercise(discipline)
  const { data: progress, refresh: refreshProgress } = useReadProgress(discipline)
  const moduleAlreadyStarted = progress !== null && progress !== 0
  const [documents, setDocuments] = useState<Document[] | null>(null)

  useFocusEffect(
    React.useCallback(() => {
      refreshNextExercise()
      refreshProgress()
    }, [refreshProgress, refreshNextExercise])
  )

  useEffect(() => {
    if (nextExercise) {
      loadDocuments({ disciplineId: nextExercise.disciplineId })
        .then(data => {
          setDocuments(data)
        })
        .catch(reportError)
    }
  }, [nextExercise])

  const navigate = () => {
    if (documents !== null && nextExercise !== null) {
      navigateToNextExercise(
        nextExercise.disciplineId,
        nextExercise.exerciseKey,
        nextExercise.disciplineTitle,
        documents
      )
    }
  }

  if (!discipline) {
    // TODO LUN-301 handle loading
    return <></>
  }

  return (
    <Card heading={discipline.title} icon={discipline.icon} onPress={() => onPress(discipline)}>
      <>
        <ProgressContainer>
          <Progress.Circle
            progress={(progress ?? 0) / discipline.numberOfChildren}
            size={50}
            indeterminate={false}
            color={theme.colors.progressIndicator}
            unfilledColor={theme.colors.disabled}
            borderWidth={0}
            thickness={6}
            testID='progress-circle'
          />
          <NumberText>
            {moduleAlreadyStarted && `${progress}/`}
            {discipline.numberOfChildren}
          </NumberText>
          <UnitText>{moduleAlreadyStarted ? labels.home.progressDescription : childrenLabel(discipline)}</UnitText>
        </ProgressContainer>
        {documents && documents.length > 0 && nextExercise && (
          <NextExerciseCard
            thumbnail={documents[0].document_image[0].image}
            onPress={navigate}
            heading={`${labels.home.level} ${nextExercise.exerciseKey}`}
            buttonLabel={labels.home.continue}
            subheading={nextExercise.disciplineTitle}
          />
        )}
        <ButtonContainer>
          <Button
            onPress={() => onPress(discipline)}
            label={labels.home.checkModules}
            buttonTheme={BUTTONS_THEME.outlined}
            disabled={documents === null || nextExercise === null}
          />
        </ButtonContainer>
      </>
    </Card>
  )
}

export default DisciplineCard
