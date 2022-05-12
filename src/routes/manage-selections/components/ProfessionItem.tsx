import React, { ReactElement } from 'react'

import { useLoadDiscipline } from '../../../hooks/useLoadDiscipline'
import SelectionItem from './SelectionItem'

interface PropsType {
  id: number
  deleteItem: () => void
}

const ProfessionItem = ({ id, deleteItem }: PropsType): ReactElement => {
  const discipline = useLoadDiscipline(id)
  return <SelectionItem discipline={discipline} deleteItem={deleteItem} />
}

export default ProfessionItem
