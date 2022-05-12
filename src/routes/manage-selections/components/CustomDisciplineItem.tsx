import React from 'react'
import styled from 'styled-components/native'

import { CloseIconRed } from '../../../../assets/images'
import ListItem from '../../../components/ListItem'
import { useLoadDiscipline } from '../../../hooks/useLoadDiscipline'
import { removeCustomDiscipline } from '../../../services/AsyncStorage'
import { reportError } from '../../../services/sentry'

interface PropsType {
  refresh: () => void
  apiKey: string
}

const CloseIconContainer = styled.Pressable`
  padding-right: ${props => props.theme.spacings.sm};
`

const CustomDisciplineItem = ({ apiKey, refresh }: PropsType): JSX.Element => {
  const { data } = useLoadDiscipline({ apiKey })

  const deleteCustomDisciplineAndRefresh = (item: string) => {
    removeCustomDiscipline(item).then(refresh).catch(reportError)
  }

  return (
    <ListItem
      title={data ? data.title : ''}
      rightChildren={
        <CloseIconContainer onPress={() => deleteCustomDisciplineAndRefresh(apiKey)} testID='delete-icon'>
          <CloseIconRed />
        </CloseIconContainer>
      }
    />
  )
}

export default CustomDisciplineItem
