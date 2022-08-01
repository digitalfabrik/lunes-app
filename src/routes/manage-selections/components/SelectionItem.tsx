import React, { useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { CloseIconRed } from '../../../../assets/images'
import CustomModal from '../../../components/CustomModal'
import ListItem from '../../../components/ListItem'
import Loading from '../../../components/Loading'
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
    <>
      <CustomModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        text={labels.manageSelection.deleteModal.confirmationQuestion}
        confirmationButtonText={labels.manageSelection.deleteModal.confirm}
        confirmationAction={deleteItem}>
        <Explanation>{labels.manageSelection.deleteModal.explanation}</Explanation>
      </CustomModal>
      <ListItem
        title={data.title}
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
