import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import styled from 'styled-components/native'

import labels from '../constants/labels.json'
import { useLoadGroupInfo } from '../hooks/useLoadGroupInfo'
import { RoutesParams } from '../navigation/NavigationTypes'
import DeletionSwipeable from './DeletionSwipeable'
import DisciplineListItem from './DisciplineListItem'
import Loading from './Loading'
import { ContentSecondaryLight } from './text/Content'

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

const CustomDisciplineItem = ({ apiKey, navigation, refresh }: CustomDisciplineItemProps): JSX.Element => {
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
        <LoadingSpinner>
          <Loading isLoading />
        </LoadingSpinner>
      </Placeholder>
    )
  }
  return (
    <DeletionSwipeable apiKey={apiKey} refresh={refresh}>
      {data ? (
        <DisciplineListItem item={data} onPress={navigate} hasBadge={false} />
      ) : (
        <Placeholder>
          <ContentSecondaryLight>
            {labels.home.errorLoadCustomDiscipline} {apiKey}
          </ContentSecondaryLight>
        </Placeholder>
      )}
    </DeletionSwipeable>
  )
}

export default CustomDisciplineItem
