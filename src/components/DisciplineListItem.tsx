import React, { ReactElement } from 'react'
import * as Progress from 'react-native-progress'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { EXERCISES } from '../constants/data'
import labels from '../constants/labels.json'
import theme from '../constants/theme'
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
  width: ${hp('3.5%')}px;
  height: ${hp('3.5%')}px;
`

const IconContainer = styled.View`
  position: absolute;
  top: ${hp('1.75%')}px;
  left: ${hp('1.75%')}px;
`

const iconWithProgress = (iconUrl: string | undefined, progress: number): ReactElement => (
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
  const [progress] = useStorage('progress')

  const badgeLabel = unit.numberWords.toString()
  const description = pluralize(labels.general.word, unit.numberWords)

  const unlockedExercises = unit.id.type === 'standard' ? getNumberOfUnlockedExercises(progress, unit.id) : 0
  const actualProgress = unlockedExercises / EXERCISES.length

  return (
    <ListItem
      title={unit.title}
      icon={iconWithProgress(unit.iconUrl ?? undefined, actualProgress)}
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
  const badgeLabel = job.numberUnits.toString()
  const description = pluralize(getLabels().general.unit, job.numberUnits)

  return (
    <ListItem
      title={job.name}
      icon={iconWithProgress(job.icon ?? undefined, 0)}
      description={description}
      onPress={onPress}
      badgeLabel={badgeLabel}
      rightChildren={rightChildren}
      disabled={disabled}
    />
  )
}
