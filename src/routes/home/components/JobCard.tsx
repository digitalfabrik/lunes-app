import React, { useState, ReactElement } from 'react'
import styled from 'styled-components/native'

import Button from '../../../components/Button'
import DeletionModal from '../../../components/DeletionModal'
import ErrorMessage, { ErrorText } from '../../../components/ErrorMessage'
import Loading from '../../../components/Loading'
import { ContentSecondary, ContentSecondaryLight } from '../../../components/text/Content'
import { Subheading } from '../../../components/text/Subheading'
import { BUTTONS_THEME } from '../../../constants/data'
import { ForbiddenError, NetworkError } from '../../../constants/endpoints'
import useLoadJob from '../../../hooks/useLoadJob'
import { useStorageCache } from '../../../hooks/useStorage'
import Job, { JobId, StandardJob } from '../../../models/Job'
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
  navigateToJob: (job: Job) => void
  navigateToTrainingExerciseSelection: (job: StandardJob) => void
}

const JobCard = ({
  identifier,
  width: cardWidth,
  navigateToJob,
  navigateToTrainingExerciseSelection,
}: JobCardProps): ReactElement | null => {
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
    if (error?.message === ForbiddenError && identifier.type === 'load-protected') {
      deleteItem = () => removeCustomDiscipline(storageCache, identifier.apiKey)
      errorMessage = `${getLabels().home.errorLoadCustomDiscipline} ${identifier.apiKey}`
    } else {
      deleteItem =
        identifier.type === 'standard'
          ? () => removeSelectedJob(storageCache, identifier)
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
    <Card width={cardWidth} heading={job.name} icon={job.icon ?? undefined}>
      {identifier.type === 'load-protected' ? (
        <CustomDisciplineDetails job={job} navigateToJob={navigateToJob} />
      ) : (
        <ModeSelection
          job={job}
          navigateToJob={() => navigateToJob(job)}
          navigateToTrainingExerciseSelection={() => navigateToTrainingExerciseSelection(job)}
        />
      )}
    </Card>
  )
}

export default JobCard
