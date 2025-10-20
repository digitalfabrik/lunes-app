import React, { ReactElement } from 'react'
import * as Progress from 'react-native-progress'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { Discipline } from '../constants/endpoints'
import theme from '../constants/theme'
import useReadProgress from '../hooks/useReadProgress'
import { childrenLabel } from '../services/helpers'
import ListItem from './ListItem'

type DisciplineListItemProps = {
  item: Discipline
  onPress: () => void
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
  rightChildren,
  disabled = false,
  showProgress = false,
}: DisciplineListItemProps): ReactElement | null => {
  const { numberOfChildren, title, icon, apiKey } = item
  const badgeLabel = numberOfChildren.toString()
  const description = childrenLabel(item)

  const actualProgress = useReadProgress(item)
  const progress = showProgress ? actualProgress : 0

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
