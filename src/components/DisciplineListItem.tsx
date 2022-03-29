import React, { ReactElement } from 'react'

import { Discipline } from '../constants/endpoints'
import { childrenDescription, childrenLabel } from '../services/helpers'
import ListItem from './ListItem'

interface DisciplineListItemProps {
  item: Discipline
  onPress: () => void
  hasBadge: boolean
  rightChildren?: ReactElement
}

const DisciplineListItem = ({
  item,
  onPress,
  hasBadge,
  rightChildren
}: DisciplineListItemProps): ReactElement | null => {
  const { numberOfChildren, title, icon } = item
  const badgeLabel = hasBadge ? numberOfChildren.toString() : undefined
  // Description either contains the number of children and the type of children or just the type of children if the number is shown as badge
  const description = hasBadge ? childrenLabel(item) : childrenDescription(item)

  if (numberOfChildren === 0) {
    return null
  }
  return (
    <ListItem
      title={title}
      icon={icon}
      description={description}
      onPress={onPress}
      badgeLabel={badgeLabel}
      rightChildren={rightChildren}
    />
  )
}

export default DisciplineListItem
