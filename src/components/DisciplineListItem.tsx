import React, { ReactElement } from 'react'
import * as Progress from 'react-native-progress'
import styled, { useTheme } from 'styled-components/native'

import { EXERCISES } from '../constants/data'
import labels from '../constants/labels.json'
import useStorage from '../hooks/useStorage'
import Job from '../models/Job'
import Unit from '../models/Unit'
import { getLabels, getNumberOfUnlockedExercises, pluralize } from '../services/helpers'
import ListItem from './ListItem'

type UnitListItemProps = {
  unit: Unit
  onPress: () => void
  rightChildren?: ReactElement
  disabled?: boolean
}

type JobListItemProps = {
  job: Job
  onPress: () => void
  rightChildren?: ReactElement
  disabled?: boolean
}

const Icon = styled.Image`
  width: ${props => props.theme.sizes.defaultIcon}px;
  height: ${props => props.theme.sizes.defaultIcon}px;
`

const IconContainer = styled.View`
  position: absolute;
  align-self: center;
`

const iconWithProgress = (
  iconUrl: string | undefined,
  progress: number,
  progressColor: string,
  unfilledColor: string,
): ReactElement => (
  <>
    <Progress.Circle
      progress={progress}
      size={56}
      indeterminate={false}
      color={progressColor}
      unfilledColor={unfilledColor}
      borderWidth={0}
      thickness={3}
      testID='progress-circle'
    />
    <IconContainer>
      <Icon source={{ uri: iconUrl }} />
    </IconContainer>
  </>
)

export const UnitListItem = ({
  unit,
  onPress,
  rightChildren,
  disabled = false,
}: UnitListItemProps): ReactElement | null => {
  const theme = useTheme()
  const [progress] = useStorage('progress')

  const badgeLabel = unit.numberWords.toString()
  const description = pluralize(labels.general.word, unit.numberWords)

  const unlockedExercises = unit.id.type === 'standard' ? getNumberOfUnlockedExercises(progress, unit.id) : 0
  const actualProgress = unlockedExercises / Object.keys(EXERCISES).length

  return (
    <ListItem
      title={unit.title}
      icon={iconWithProgress(
        unit.iconUrl ?? undefined,
        actualProgress,
        theme.colors.progressIndicator,
        theme.colors.disabled,
      )}
      description={description}
      onPress={onPress}
      badgeLabel={badgeLabel}
      rightChildren={rightChildren}
      disabled={disabled}
    />
  )
}

export const JobListItem = ({
  job,
  onPress,
  rightChildren,
  disabled = false,
}: JobListItemProps): ReactElement | null => {
  const theme = useTheme()
  const badgeLabel = job.numberOfUnits.toString()
  const description = pluralize(getLabels().general.unit, job.numberOfUnits)

  return (
    <ListItem
      title={job.name}
      icon={iconWithProgress(job.icon ?? undefined, 0, theme.colors.progressIndicator, theme.colors.disabled)}
      description={description}
      onPress={onPress}
      badgeLabel={badgeLabel}
      rightChildren={rightChildren}
      disabled={disabled}
    />
  )
}
