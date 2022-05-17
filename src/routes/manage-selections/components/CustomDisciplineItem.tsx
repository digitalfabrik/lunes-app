import React, { ReactElement } from 'react'

import { useLoadGroupInfo } from '../../../hooks/useLoadGroupInfo'
import SelectionItem from './SelectionItem'

interface PropsType {
  apiKey: string
  deleteItem: () => void
}

const CustomDisciplineItem = ({ apiKey, deleteItem }: PropsType): ReactElement => {
  const discipline = useLoadGroupInfo(apiKey)
  return <SelectionItem discipline={discipline} deleteItem={deleteItem} />
}

export default CustomDisciplineItem
