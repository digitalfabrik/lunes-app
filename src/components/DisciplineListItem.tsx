import React, { ReactElement } from 'react'

import { Discipline } from '../constants/endpoints'
import { childrenDescription, childrenLabel } from '../services/helpers'
import ListItem from './ListItem'

interface DisciplineListItemProps {
  item: Discipline
  onPress: () => void
  badge: boolean
}

const DisciplineListItem = ({ item, onPress, badge }: DisciplineListItemProps): ReactElement | null => {
  const { numberOfChildren, title, icon } = item
  const badgeLabel = badge ? numberOfChildren.toString() : undefined
  const description = badge ? childrenLabel(item) : childrenDescription(item)

  if (numberOfChildren === 0) {
    return null
  }
  return <ListItem title={title} icon={icon} description={description} onPress={onPress} badgeLabel={badgeLabel} />
}

export default DisciplineListItem
