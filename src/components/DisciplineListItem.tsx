import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement, useState } from 'react'
import * as Progress from 'react-native-progress'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { Discipline } from '../constants/endpoints'
import theme from '../constants/theme'
import { childrenDescription, childrenLabel, getProgress } from '../services/helpers'
import { reportError } from '../services/sentry'
import ListItem from './ListItem'

interface DisciplineListItemProps {
  item: Discipline
  onPress: () => void
  hasBadge: boolean
  rightChildren?: ReactElement
  disabled?: boolean
  showProgress?: boolean
}

const Icon = styled.Image`
  width: ${hp('3.5%')}px;
  height: ${hp('3.5%')}px;
`

const IconContainer = styled.View`
  position: absolute;
  top: ${hp('1.75%')}px;
  left: ${hp('1.75%')}px;
`

const DisciplineListItem = ({
  item,
  onPress,
  hasBadge,
  rightChildren,
  disabled = false,
  showProgress = false,
}: DisciplineListItemProps): ReactElement | null => {
  const { numberOfChildren, title, icon, apiKey } = item
  const badgeLabel = hasBadge ? numberOfChildren.toString() : undefined
  // Description either contains the number of children and the type of children or just the type of children if the number is shown as badge
  const description = hasBadge ? childrenLabel(item) : childrenDescription(item)

  const [progress, setProgress] = useState<number>(0)

  useFocusEffect(() => {
    if (showProgress) {
      getProgress(item).then(setProgress).catch(reportError)
    }
  })

  const iconWithProgress = (
    <>
      <Progress.Circle
        progress={progress}
        size={Math.round(hp('7%'))}
        indeterminate={false}
        color={theme.colors.progressIndicator}
        unfilledColor={theme.colors.disabled}
        borderWidth={0}
        thickness={3}
        testID='progress-circle'
      />
      <IconContainer>
        <Icon source={{ uri: icon }} />
      </IconContainer>
    </>
  )

  if (numberOfChildren === 0 && !apiKey) {
    return null
  }
  return (
    <ListItem
      title={title}
      icon={showProgress ? iconWithProgress : icon}
      description={description}
      onPress={onPress}
      badgeLabel={badgeLabel}
      rightChildren={rightChildren}
      disabled={disabled}
    />
  )
}

export default DisciplineListItem
