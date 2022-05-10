import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import styled from 'styled-components/native'

import Button from '../../../components/Button'
import ErrorMessage from '../../../components/ErrorMessage'
import Loading from '../../../components/Loading'
import { ContentSecondary, ContentSecondaryLight } from '../../../components/text/Content'
import { Subheading } from '../../../components/text/Subheading'
import { BUTTONS_THEME } from '../../../constants/data'
import { ForbiddenError } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import { useLoadGroupInfo } from '../../../hooks/useLoadGroupInfo'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import AsyncStorage from '../../../services/AsyncStorage'
import { childrenLabel } from '../../../services/helpers'
import Card from './Card'

const LoadingContainer = styled.View`
  padding-top: ${props => props.theme.spacings.xxl};
`

const TextContainer = styled.View`
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
  margin: ${props => props.theme.spacings.xxs} auto;
`

const ErrorMessageForbidden = styled(ContentSecondaryLight)`
  padding-top: ${props => props.theme.spacings.xl};
`

interface CustomDisciplineItemProps {
  apiKey: string
  navigation: StackNavigationProp<RoutesParams, 'Home'>
  refresh: () => void
}

const CustomDiscipline = ({ apiKey, navigation, refresh: refreshHome }: CustomDisciplineItemProps): JSX.Element => {
  const { data: discipline, loading, error, refresh } = useLoadGroupInfo(apiKey)

  const navigate = (): void => {
    if (!discipline) {
      return
    }
    navigation.navigate('DisciplineSelection', {
      discipline
    })
  }

  const deleteCustomDiscipline = async (): Promise<void> =>
    AsyncStorage.removeCustomDiscipline(apiKey).then(refreshHome)

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
        {error?.message === ForbiddenError ? (
          <>
            <ErrorMessageForbidden>
              {labels.home.errorLoadCustomDiscipline} {apiKey}
            </ErrorMessageForbidden>
            <ButtonContainer>
              <Button
                onPress={deleteCustomDiscipline}
                label={labels.home.deleteModal.confirm}
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
    <Card heading={discipline.title} icon={discipline.icon} onPress={navigate}>
      <>
        <TextContainer>
          <NumberText>{discipline.numberOfChildren}</NumberText>
          <UnitText>{childrenLabel(discipline)}</UnitText>
        </TextContainer>
        <ButtonContainer>
          <Button onPress={navigate} label={labels.home.start} buttonTheme={BUTTONS_THEME.outlined} />
        </ButtonContainer>
      </>
    </Card>
  )
}

export default CustomDiscipline
