import React, { ReactElement } from 'react'

import { CloseIconRed } from '../../../../assets/images'
import ListItem from '../../../components/ListItem'
import { useLoadDiscipline } from '../../../hooks/useLoadDiscipline'
import { removeCustomDiscipline } from '../../../services/AsyncStorage'
import { reportError } from '../../../services/sentry'
import SelectionItem from './SelectionItem'

interface PropsType {
  apiKey: string
  deleteItem: () => void
}

const CustomDisciplineItem = ({ apiKey, deleteItem }: PropsType): ReactElement => {
  const data = useLoadDiscipline({ apiKey })
  return <SelectionItem discipline={data} deleteItem={deleteItem} />
}

export default CustomDisciplineItem
