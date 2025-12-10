import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import PressableOpacity from '../../../components/PressableOpacity'
import { Content } from '../../../components/text/Content'
import { Heading } from '../../../components/text/Heading'
import { Color, COLORS } from '../../../constants/theme/colors'
import useLoadProgress from '../../../hooks/useLoadProgress'
import Job from '../../../models/Job'
import { getLabels, pluralize } from '../../../services/helpers'

const Container = styled.View`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacings.sm};
  padding: ${props => props.theme.spacings.sm} 0;
`

const LearningModeCardContainer = styled.View<{ backgroundColor: string }>`
  display: flex;
  flex-grow: 1;
  align-items: center;
  gap: ${props => props.theme.spacings.xs};
  padding: ${props => props.theme.spacings.sm} 0;
  background-color: ${props => props.backgroundColor};
  border-radius: ${props => props.theme.spacings.xs};
`

const Row = styled.View`
  display: flex;
  flex-direction: row;
  gap: ${props => props.theme.spacings.xxs};
`

const ProgressContainer = styled.View`
  display: inline;
  background-color: ${props => props.theme.colors.backgroundRed};
  border-radius: ${props => props.theme.spacings.xs};
  padding: 0 ${props => props.theme.spacings.xxs};
`

const LearningModeTitle = styled(Heading)`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  padding-right: ${props => props.theme.spacings.sm};
  color: ${props => props.theme.colors.textLight};
`

const LearningModeText = styled(Content)`
  color: ${props => props.theme.colors.textLight};
`

type LearningModeCardProps = {
  title: string
  numberUnits: number
  unitsCompleted: number
  color: Color
  onPress: () => void
}

const LearningModeCard = ({
  title,
  numberUnits,
  unitsCompleted,
  color,
  onPress,
}: LearningModeCardProps): ReactElement => (
  <PressableOpacity onPress={onPress}>
    <LearningModeCardContainer backgroundColor={color}>
      <LearningModeTitle>{title}</LearningModeTitle>
      <Row>
        <ProgressContainer>
          <LearningModeText>
            {unitsCompleted}/{numberUnits}
          </LearningModeText>
        </ProgressContainer>
        <LearningModeText>{pluralize(getLabels().general.unit, numberUnits)}</LearningModeText>
      </Row>
    </LearningModeCardContainer>
  </PressableOpacity>
)

export type ModeSelectionProps = {
  job: Job
  navigateToJob: () => void
  navigateToTrainingExerciseSelection: () => void
}

const ModeSelection = ({
  job,
  navigateToJob,
  navigateToTrainingExerciseSelection,
}: ModeSelectionProps): ReactElement => {
  const { data: progress } = useLoadProgress(job)
  const completedUnits = Math.floor((progress ?? 0) * job.numberOfUnits)

  return (
    <Container>
      <LearningModeCard
        title={getLabels().home.learnVocabulary}
        numberUnits={job.numberOfUnits}
        unitsCompleted={completedUnits}
        color={COLORS.backgroundBlue}
        onPress={navigateToJob}
      />
      <LearningModeCard
        title={getLabels().home.trainVocabulary}
        numberUnits={1}
        unitsCompleted={0}
        color={COLORS.backgroundTeal}
        onPress={navigateToTrainingExerciseSelection}
      />
    </Container>
  )
}

export default ModeSelection
