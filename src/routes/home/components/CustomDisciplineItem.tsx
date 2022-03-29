import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import styled from 'styled-components/native'

import Loading from '../../../components/Loading'
import { ContentSecondaryLight } from '../../../components/text/Content'
import labels from '../../../constants/labels.json'
import { useLoadGroupInfo } from '../../../hooks/useLoadGroupInfo'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import DisciplineCard from './DisciplineCard'

const Placeholder = styled.View`
  background-color: ${props => props.theme.colors.backgroundAccent};
  margin: ${props => `0 ${props.theme.spacings.sm} ${props.theme.spacings.xs} ${props.theme.spacings.sm}`};
  border: 1px solid ${prop => prop.theme.colors.disabled};
  border-radius: 2px;
  padding: ${props => props.theme.spacings.sm};
`

const LoadingSpinner = styled.View`
  padding-top: ${props => props.theme.spacings.xl};
`

interface CustomDisciplineItemProps {
  apiKey: string
  navigation: StackNavigationProp<RoutesParams, 'Home'>
  refresh: () => void
}

const CustomDisciplineItem = ({ apiKey, navigation }: CustomDisciplineItemProps): JSX.Element => {
  const { data, loading } = useLoadGroupInfo(apiKey)

  const navigate = (): void => {
    if (!data) {
      return
    }
    navigation.navigate('DisciplineSelection', {
      discipline: data
    })
  }

  if (loading) {
    return (
      <Placeholder>
        {/* TODO adjust height of Placeholder */}
        <LoadingSpinner>
          <Loading isLoading />
        </LoadingSpinner>
      </Placeholder>
    )
  }
  return (
    <>
      {data ? (
        <DisciplineCard discipline={data} showProgress={false} onPress={navigate} navigateToNextExercise={navigate} />
      ) : (
        <Placeholder>
          <ContentSecondaryLight>
            {labels.home.errorLoadCustomDiscipline} {apiKey}
          </ContentSecondaryLight>
        </Placeholder>
      )}
    </>
  )
}

export default CustomDisciplineItem
