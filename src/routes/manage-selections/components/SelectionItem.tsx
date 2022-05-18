import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { CloseIconRed } from '../../../../assets/images'
import ListItem from '../../../components/ListItem'
import Loading from '../../../components/Loading'
import { ForbiddenError, NetworkError } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import { DisciplineRequestData, useLoadDiscipline } from '../../../hooks/useLoadDiscipline'

interface PropsType {
  identifier: DisciplineRequestData
  deleteItem: () => void
}

const CloseIconContainer = styled.Pressable`
  padding-right: ${props => props.theme.spacings.sm};
`

const LoadingContainer = styled(View)`
  height: 0px;
`

const SelectionItem = ({ identifier, deleteItem }: PropsType): JSX.Element => {
  const { data, loading, error } = useLoadDiscipline(identifier)

  if (loading) {
    return (
      <LoadingContainer>
        <Loading isLoading={loading} />
      </LoadingContainer>
    )
  }

  if (!data) {
    let errorMessage = labels.general.error.unknown
    if (error?.message === ForbiddenError) {
      errorMessage = labels.home.errorLoadCustomDiscipline
    } else if (error?.message === NetworkError) {
      errorMessage = `${labels.general.error.noWifi} (${error.message})`
    }
    return <ListItem title={errorMessage} />
  }

  return (
    <ListItem
      title={data.title}
      rightChildren={
        <CloseIconContainer onPress={deleteItem} testID='delete-icon'>
          <CloseIconRed />
        </CloseIconContainer>
      }
    />
  )
}

export default SelectionItem
