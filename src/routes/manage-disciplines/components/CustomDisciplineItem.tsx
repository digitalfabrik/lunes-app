import React from 'react'
import { Pressable } from 'react-native'

import { CloseIconRed } from '../../../../assets/images'
import ListItem from '../../../components/ListItem'
import { useLoadGroupInfo } from '../../../hooks/useLoadGroupInfo'
import { removeCustomDiscipline } from '../../../services/AsyncStorage'
import { reportError } from '../../../services/sentry'

interface PropsType {
  refresh: () => void
  apiKey: string
}

const CustomDisciplineItem = ({ apiKey, refresh }: PropsType): JSX.Element => {
  const { data } = useLoadGroupInfo(apiKey)

  const deleteCustomDisciplineAndRefresh = (item: string) => {
    removeCustomDiscipline(item)
      .then(refresh)
      .catch(err => reportError(err))
  }

  return (
    <ListItem
      title={data ? data.title : ''}
      onPress={() => console.log('pressed')}
      rightChildren={
        <Pressable onPress={() => deleteCustomDisciplineAndRefresh(apiKey)}>
          <CloseIconRed />
        </Pressable>
      }
    />
  )
}

export default CustomDisciplineItem
