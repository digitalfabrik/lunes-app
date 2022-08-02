import React from 'react'
import styled from 'styled-components/native'

import Button from '../../../components/Button'
import ErrorMessage from '../../../components/ErrorMessage'
import Loading from '../../../components/Loading'
import { ContentSecondary, ContentSecondaryLight } from '../../../components/text/Content'
import { Subheading } from '../../../components/text/Subheading'
import { BUTTONS_THEME, NextExerciseData } from '../../../constants/data'
import { Discipline, ForbiddenError } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import { isTypeLoadProtected } from '../../../hooks/helpers'
import { RequestParams, useLoadDiscipline } from '../../../hooks/useLoadDiscipline'
import AsyncStorage from '../../../services/AsyncStorage'
import Card from './Card'
import CustomDisciplineDetails from './CustomDisciplineDetails'
import ProfessionDetails from './ProfessionDetails'

const LoadingContainer = styled.View`
  padding-top: ${props => props.theme.spacings.xxl};
`

const ErrorMessageForbidden = styled(ContentSecondaryLight)`
  padding-top: ${props => props.theme.spacings.xl};
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

interface PropsType {
  identifier: RequestParams
  refresh?: () => void
  navigateToDiscipline: (discipline: Discipline) => void
  navigateToNextExercise?: (nextExerciseData: NextExerciseData) => void
}

const DisciplineCard = ({
  identifier,
  refresh: refreshHome,
  navigateToDiscipline,
  navigateToNextExercise,
}: PropsType): JSX.Element => {
  const { data: discipline, loading, error, refresh } = useLoadDiscipline(identifier)

  if (loading) {
    return (
      <Card>
        <LoadingContainer>
          <Loading isLoading={loading} />
        </LoadingContainer>
      </Card>
    )
  }

  if (!discipline) {
    return (
      <Card>
        {error?.message === ForbiddenError && isTypeLoadProtected(identifier) ? (
          <>
            <ErrorMessageForbidden>
              {labels.home.errorLoadCustomDiscipline} {identifier.apiKey}
            </ErrorMessageForbidden>
            <ButtonContainer>
              <Button
                onPress={() => AsyncStorage.removeCustomDiscipline(identifier.apiKey).then(refreshHome)}
                label={labels.home.deleteProfession}
                buttonTheme={BUTTONS_THEME.outlined}
              />
            </ButtonContainer>
          </>
        ) : (
          <ErrorMessage error={error} refresh={refresh} />
        )}
      </Card>
    )
  }

  return (
    <Card heading={discipline.title} icon={discipline.icon} onPress={() => navigateToDiscipline(discipline)}>
      {isTypeLoadProtected(identifier) ? (
        <CustomDisciplineDetails discipline={discipline} navigateToDiscipline={navigateToDiscipline} />
      ) : (
        navigateToNextExercise && (
          <ProfessionDetails
            discipline={discipline}
            navigateToDiscipline={navigateToDiscipline}
            navigateToNextExercise={navigateToNextExercise}
          />
        )
      )}
    </Card>
  )
}

export default DisciplineCard
