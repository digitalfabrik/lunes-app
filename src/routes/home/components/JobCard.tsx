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
import { RequestParams } from '../../../hooks/useLoadDiscipline'
import useLoadJob from '../../../hooks/useLoadJob'
import { useStorageCache } from '../../../hooks/useStorage'
import { getLabels } from '../../../services/helpers'
import { removeCustomDiscipline, removeSelectedJob } from '../../../services/storageUtils'
import Card from './Card'
import CustomDisciplineDetails from './CustomDisciplineDetails'
import JobDetails from './JobDetails'

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

type DisciplineCardProps = {
  identifier: RequestParams
  width?: number
  navigateToDiscipline: (discipline: Discipline) => void
  navigateToNextExercise?: (nextExerciseData: NextExerciseData) => void
}

const JobCard = ({
  identifier,
  width: cardWidth,
  navigateToDiscipline,
  navigateToNextExercise,
}: DisciplineCardProps): JSX.Element | null => {
  const storageCache = useStorageCache()
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

  return (
    <Card width={cardWidth} heading={job.title} icon={job.icon} onPress={() => navigateToDiscipline(job)}>
      {isTypeLoadProtected(identifier) ? (
        <CustomDisciplineDetails discipline={job} navigateToDiscipline={navigateToDiscipline} />
      ) : (
        navigateToNextExercise && (
          <JobDetails
            discipline={job}
            navigateToDiscipline={navigateToDiscipline}
            navigateToNextExercise={navigateToNextExercise}
          />
        )
      )}
    </Card>
  )
}

export default JobCard
