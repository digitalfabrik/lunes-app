import React, { ReactElement } from 'react'
import * as Progress from 'react-native-progress'
import styled, { useTheme } from 'styled-components/native'

import { EXERCISES } from '../constants/data'
import labels from '../constants/labels.json'
import useContentArea from '../hooks/useContentArea'
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

const PROGRESS_CIRCLE_SIZE = 56
const PROGRESS_CIRCLE_THICKNESS = 3

const iconWithProgress = (
  iconUrl: string | undefined,
  progress: number,
  progressColor: string,
  unfilledColor: string,
): ReactElement => (
  <>
    <Progress.Circle
      progress={progress}
      size={PROGRESS_CIRCLE_SIZE}
      indeterminate={false}
      color={progressColor}
      unfilledColor={unfilledColor}
      borderWidth={0}
      thickness={PROGRESS_CIRCLE_THICKNESS}
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

const LIGHT_BACKGROUND_OPACITY = 0.1
const BADGE_BORDER_RADIUS = 12.5
const BADGE_VERTICAL_PADDING = 2

const ContentAreaBadge = styled.View<{ brandColor: string }>`
  border: 1px solid ${props => props.brandColor};
  border-radius: ${BADGE_BORDER_RADIUS}px;
  padding: ${BADGE_VERTICAL_PADDING}px ${props => props.theme.spacings.xs};
  margin-left: ${props => props.theme.spacings.xxs};
  overflow: hidden;
  flex-shrink: 1;
`

const ContentAreaBadgeBackground = styled.View<{ brandColor: string }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${props => props.brandColor};
  opacity: ${LIGHT_BACKGROUND_OPACITY};
`

const ContentAreaBadgeText = styled.Text`
  font-family: ${props => props.theme.fonts.contentFontBold};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fonts.smallFontSize};
`

const BRANDED_FRAME_BORDER_WIDTH = 2

const BrandedIconFrame = styled.View<{ brandColor: string }>`
  width: ${PROGRESS_CIRCLE_SIZE}px;
  height: ${PROGRESS_CIRCLE_SIZE}px;
  border-radius: ${PROGRESS_CIRCLE_SIZE / 2}px;
  border: ${BRANDED_FRAME_BORDER_WIDTH}px solid ${props => props.brandColor};
  align-items: center;
  justify-content: center;
`

export const JobListItem = ({
  job,
  onPress,
  rightChildren,
  disabled = false,
}: JobListItemProps): ReactElement | null => {
  const theme = useTheme()
  const badgeLabel = job.numberOfUnits.toString()
  const description = pluralize(getLabels().general.unit, job.numberOfUnits)
  const contentArea = useContentArea(job.token)
  const brandColor = contentArea?.primaryColor ?? theme.colors.textSecondary
  const icon = contentArea ? (
    <BrandedIconFrame brandColor={brandColor} testID='branded-icon-frame'>
      <Icon source={{ uri: job.icon ?? undefined }} />
    </BrandedIconFrame>
  ) : (
    iconWithProgress(job.icon ?? undefined, 0, theme.colors.progressIndicator, theme.colors.disabled)
  )

  return (
    <ListItem
      title={job.name}
      icon={icon}
      description={description}
      onPress={onPress}
      badgeLabel={badgeLabel}
      afterDescription={
        contentArea ? (
          <ContentAreaBadge brandColor={brandColor} testID='content-area-badge'>
            <ContentAreaBadgeBackground brandColor={brandColor} testID='content-area-badge-background' />
            <ContentAreaBadgeText numberOfLines={1}>{contentArea.name}</ContentAreaBadgeText>
          </ContentAreaBadge>
        ) : undefined
      }
      rightChildren={rightChildren}
      disabled={disabled}
    />
  )
}
