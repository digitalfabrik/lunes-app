import React, { useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { CloseIconRed } from '../../../../assets/images'
import ListItem from '../../../components/ListItem'
import Loading from '../../../components/Loading'
import Modal from '../../../components/Modal'
import { ContentSecondary } from '../../../components/text/Content'
import { ForbiddenError, NetworkError } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import { RequestParams, useLoadDiscipline } from '../../../hooks/useLoadDiscipline'

interface PropsType {
  identifier: RequestParams
  deleteItem: () => void
}

const CloseIconContainer = styled.Pressable`
  padding-right: ${props => props.theme.spacings.sm};
`

const LoadingContainer = styled(View)`
  height: 0px;
`

const Explanation = styled(ContentSecondary)`
  padding: 0 ${props => props.theme.spacings.lg} ${props => props.theme.spacings.xl};
  text-align: center;
`

const SelectionItem = ({ identifier, deleteItem }: PropsType): JSX.Element => {
  const { data, loading, error } = useLoadDiscipline(identifier)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

  if (loading) {
    return (
      <LoadingContainer>
        <Loading isLoading={loading} />
      </LoadingContainer>
    )
  }

  if (!data && error?.message === NetworkError) {
    return <ListItem title={`${labels.general.error.noWifi} (${error.message})`} />
  }

  return (
    <>
      <Modal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        text={labels.manageSelection.deleteModal.confirmationQuestion}
        confirmationButtonText={labels.manageSelection.deleteModal.confirm}
        confirmationAction={deleteItem}>
        <Explanation>{labels.manageSelection.deleteModal.explanation}</Explanation>
      </Modal>
      <ListItem
        title={
          data?.title ??
          (error?.message === ForbiddenError ? labels.home.errorLoadCustomDiscipline : labels.general.error.unknown)
        }
        rightChildren={
          <CloseIconContainer onPress={() => setIsModalVisible(true)} testID='delete-icon'>
            <CloseIconRed />
          </CloseIconContainer>
        }
      />
    </>
  )
}

export default SelectionItem
