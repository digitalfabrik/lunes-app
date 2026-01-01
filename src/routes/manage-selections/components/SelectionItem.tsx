import React, { useState, ReactElement } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { CloseIconRed } from '../../../../assets/images'
import DeletionModal from '../../../components/DeletionModal'
import ListItem from '../../../components/ListItem'
import Loading from '../../../components/Loading'
import { ForbiddenError, NetworkError } from '../../../constants/endpoints'
import useLoadJob from '../../../hooks/useLoadJob'
import { JobId } from '../../../models/Job'
import { getLabels } from '../../../services/helpers'

type SelectionItemProps = {
  identifier: JobId
  deleteItem: () => void
}

const CloseIconContainer = styled.Pressable`
  padding-right: ${props => props.theme.spacings.sm};
`

const LoadingContainer = styled(View)`
  height: 0px;
`

const SelectionItem = ({ identifier, deleteItem }: SelectionItemProps): ReactElement => {
  const { data, loading, error } = useLoadJob(identifier)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

  if (loading) {
    return (
      <LoadingContainer>
        <Loading isLoading={loading} />
      </LoadingContainer>
    )
  }

  if (!data && error?.message === NetworkError) {
    return <ListItem title={`${getLabels().general.error.noWifi} (${error.message})`} hideRightChildren />
  }

  return (
    <>
      <DeletionModal isVisible={isModalVisible} onConfirm={deleteItem} onClose={() => setIsModalVisible(false)} />
      <ListItem
        title={
          data?.name ??
          (error?.message === ForbiddenError && identifier.type === 'load-protected'
            ? `${getLabels().home.errorLoadCustomDiscipline} ${identifier.apiKey}`
            : getLabels().general.error.unknown)
        }
        icon={data?.icon ?? undefined}
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
