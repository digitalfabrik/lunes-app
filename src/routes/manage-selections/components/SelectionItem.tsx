import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { CloseIconRed } from '../../../../assets/images'
import ListItem from '../../../components/ListItem'
import Loading from '../../../components/Loading'
import { Discipline, ForbiddenError, NetworkError } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import { Return } from '../../../hooks/useLoadAsync'

interface PropsType {
  discipline: Return<Discipline>
  deleteItem: () => void
}

const CloseIconContainer = styled.Pressable`
  padding-right: ${props => props.theme.spacings.sm};
`

const LoadingContainer = styled(View)`
  height: 0px;
`

const SelectionItem = ({ discipline, deleteItem }: PropsType): JSX.Element => {
  const { data, loading, error } = discipline
  let errorMessage = labels.general.error.unknown
  if (error?.message === ForbiddenError) {
    errorMessage = labels.home.errorLoadCustomDiscipline
  } else if (error?.message === NetworkError) {
    errorMessage = `${labels.general.error.noWifi} (${error.message})`
  }

  const loadingOrError = loading ? (
    <LoadingContainer>
      <Loading isLoading={loading} />
    </LoadingContainer>
  ) : (
    errorMessage
  )

  return (
    <ListItem
      title={data ? data.title : loadingOrError}
      rightChildren={
        data ? (
          <CloseIconContainer onPress={deleteItem} testID='delete-icon'>
            <CloseIconRed />
          </CloseIconContainer>
        ) : (
          <></>
        )
      }
    />
  )
}

export default SelectionItem
