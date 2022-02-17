import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import labels from '../constants/labels.json'
import { useLoadGroupInfo } from '../hooks/useLoadGroupInfo'
import { RoutesParams } from '../navigation/NavigationTypes'
import { childrenDescription } from '../services/helpers'
import DeletionSwipeable from './DeletionSwipeable'
import DisciplineItem from './DisciplineItem'
import Loading from './Loading'

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

const Description = styled.Text<{ selected: boolean }>`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${props => (props.selected ? props.theme.colors.backgroundAccent : props.theme.colors.textSecondary)};
`

const ErrorText = styled.Text`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${props => props.theme.colors.primary};
`

interface CustomDisciplineItemProps {
  apiKey: string
  selectedId: string | null
  setSelectedId: (selectedId: string) => void
  navigation: StackNavigationProp<RoutesParams, 'Home'>
  refresh: () => void
}

const CustomDisciplineItem = ({
  apiKey,
  selectedId,
  setSelectedId,
  navigation,
  refresh
}: CustomDisciplineItemProps): JSX.Element => {
  const { data, loading } = useLoadGroupInfo(apiKey)

  const idToSelectedIdString = (id: number): string => `custom-${id}`

  const navigate = (): void => {
    if (!data) {
      return
    }
    setSelectedId(idToSelectedIdString(data.id))
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
        <DisciplineItem item={data} selected={idToSelectedIdString(data.id) === selectedId} onPress={navigate}>
          <Description selected={idToSelectedIdString(data.id) === selectedId}>{childrenDescription(data)}</Description>
        </DisciplineItem>
      ) : (
        <Placeholder>
          <ErrorText>
            {labels.home.errorLoadCustomDiscipline} {apiKey}
          </ErrorText>
        </Placeholder>
      )}
    </DeletionSwipeable>
  )
}

export default CustomDisciplineItem
