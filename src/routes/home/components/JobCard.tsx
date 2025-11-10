import React, { useState } from 'react'
import styled from 'styled-components/native'

import Button from '../../../components/Button'
import DeletionModal from '../../../components/DeletionModal'
import ErrorMessage, { ErrorText } from '../../../components/ErrorMessage'
import Loading from '../../../components/Loading'
import { ContentSecondary, ContentSecondaryLight } from '../../../components/text/Content'
import { Subheading } from '../../../components/text/Subheading'
import { BUTTONS_THEME, NextExerciseData } from '../../../constants/data'
import { Discipline, ForbiddenError, NetworkError } from '../../../constants/endpoints'
import { isTypeLoadProtected } from '../../../hooks/helpers'
import useLoadJob from '../../../hooks/useLoadJob'
import { loadNextExercise } from '../../../hooks/useLoadNextExercise'
import useStorage, { useStorageCache } from '../../../hooks/useStorage'
import { JobId } from '../../../services/CmsApi'
import { getLabels } from '../../../services/helpers'
import { removeCustomDiscipline, removeSelectedJob } from '../../../services/storageUtils'
import Card from './Card'
import CustomDisciplineDetails from './CustomDisciplineDetails'
import ModeSelection from './ModeSelection'

const LoadingContainer = styled.View`
  padding-top: ${props => props.theme.spacings.xxl};
`

const ErrorMessageModified = styled(ContentSecondaryLight)`
  padding: ${props => props.theme.spacings.md};
  text-align: center;
  display: flex;
  align-items: center;
`

export const NumberText = styled(Subheading)`
  font-size: ${props => props.theme.fonts.headingFontSize};
  padding: ${props => props.theme.spacings.xs};
`

export const UnitText = styled(ContentSecondary)`
  font-size: ${props => props.theme.fonts.headingFontSize};
`

export const ButtonContainer = styled.View`
  margin: ${props => props.theme.spacings.xxs} auto;
`

type JobCardProps = {
  identifier: JobId
  width?: number
  navigateToDiscipline: (discipline: Discipline) => void
  navigateToExercise: (nextExerciseData: NextExerciseData) => void
  navigateToTrainingExerciseSelection: (job: Discipline) => void
}

const JobCard = ({
  identifier,
  width: cardWidth,
  navigateToDiscipline,
  navigateToExercise,
  navigateToTrainingExerciseSelection,
}: JobCardProps): JSX.Element | null => {
  const storageCache = useStorageCache()
  const [progress] = useStorage('progress')
  const { data: job, loading, error, refresh } = useLoadJob(identifier)
  const [isModalVisible, setIsModalVisible] = useState(false)

  if (loading) {
    return (
      <Card width={cardWidth}>
        <LoadingContainer>
          <Loading isLoading={loading} />
        </LoadingContainer>
      </Card>
    )
  }

  if (!job) {
    if (error?.message === NetworkError) {
      return (
        <Card width={cardWidth}>
          <ErrorMessage error={error} refresh={refresh} contained />
        </Card>
      )
    }

    let deleteItem
    let errorMessage
    if (error?.message === ForbiddenError && isTypeLoadProtected(identifier)) {
      deleteItem = () => removeCustomDiscipline(storageCache, identifier.apiKey)
      errorMessage = `${getLabels().home.errorLoadCustomDiscipline} ${identifier.apiKey}`
    } else {
      deleteItem = !isTypeLoadProtected(identifier)
        ? () => removeSelectedJob(storageCache, identifier.disciplineId)
        : () => setIsModalVisible(false)
      errorMessage = getLabels().general.error.unknown
    }

    return (
      <>
        <DeletionModal isVisible={isModalVisible} onConfirm={deleteItem} onClose={() => setIsModalVisible(false)} />
        <Card width={cardWidth}>
          <ErrorMessageModified>
            <ErrorText>{errorMessage}</ErrorText>
          </ErrorMessageModified>
          <ButtonContainer testID='delete-button'>
            <Button
              onPress={() => setIsModalVisible(true)}
              label={getLabels().home.deleteJob}
              buttonTheme={BUTTONS_THEME.outlined}
              fitToContentWidth
            />
          </ButtonContainer>
        </Card>
      </>
    )
  }

  const navigateToNextExercise = async (): Promise<void> => {
    const nextExerciseData = await loadNextExercise(progress, job)
    navigateToExercise(nextExerciseData)
  }

  return (
    <Card width={cardWidth} heading={job.title} icon={job.icon} onPress={() => navigateToDiscipline(job)}>
      {isTypeLoadProtected(identifier) ? (
        <CustomDisciplineDetails discipline={job} navigateToDiscipline={navigateToDiscipline} />
      ) : (
        <ModeSelection
          job={job}
          navigateToNextExercise={navigateToNextExercise}
          navigateToTrainingExerciseSelection={() => navigateToTrainingExerciseSelection(job)}
        />
      )}
    </Card>
  )
}

export default JobCard
