import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { NurseImage } from '../../../../assets/images'
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
  flex-grow: 1;
  background-color: ${props => props.backgroundColor};
  border-radius: ${props => props.theme.spacings.xs};
  overflow: hidden;
`

const LearningModeCardContentContainer = styled.View`
  display: flex;
  flex-grow: 1;
  align-items: center;
  gap: ${props => props.theme.spacings.xs};
  padding: ${props => props.theme.spacings.sm} 0;
  border-radius: ${props => props.theme.spacings.xs};
`

const LearnModeProgressBar = styled.View<{ progress: number }>`
  background-color: #f1635f;
  width: ${props => props.progress * 100}%;
  height: ${props => props.theme.spacings.xs};
`

const TrainModeImage = styled.Image`
  position: absolute;
  top: 15px;
  width: 100%;
  height: 100%;
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
`

const LearningModeText = styled(Content)``

type LearningCardProps = {
  title: string
  numberUnits: number
  unitsCompleted: number
  color: Color
  onPress: () => void
}
const LearningCard = ({ title, numberUnits, unitsCompleted, color, onPress }: LearningCardProps): ReactElement => (
  <PressableOpacity onPress={onPress}>
    <LearningModeCardContainer backgroundColor={color}>
      <LearningModeCardContentContainer>
        <LearningModeTitle>{title}</LearningModeTitle>
        <Row>
          <ProgressContainer>
            <LearningModeText>
              {unitsCompleted}/{numberUnits}
            </LearningModeText>
          </ProgressContainer>
          <LearningModeText>{pluralize(getLabels().general.unit, numberUnits)}</LearningModeText>
        </Row>
      </LearningModeCardContentContainer>
      <LearnModeProgressBar progress={unitsCompleted / numberUnits} />
    </LearningModeCardContainer>
  </PressableOpacity>
)

type TrainingCardProps = {
  onPress: () => void
}
const TrainingCard = ({ onPress }: TrainingCardProps): ReactElement => (
  <PressableOpacity onPress={onPress}>
    <LearningModeCardContainer backgroundColor={COLORS.backgroundTeal}>
      <LearningModeCardContentContainer>
        <LearningModeTitle>{getLabels().home.trainVocabulary}</LearningModeTitle>
        <LearningModeText>{getLabels().home.testYourKnowledge}</LearningModeText>
      </LearningModeCardContentContainer>
      <TrainModeImage source={NurseImage} resizeMode='none' />
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
      <LearningCard
        title={getLabels().home.learnVocabulary}
        numberUnits={job.numberOfUnits}
        unitsCompleted={completedUnits}
        color={COLORS.backgroundBlue}
        onPress={navigateToJob}
      />
      <TrainingCard onPress={navigateToTrainingExerciseSelection} />
    </Container>
  )
}

export default ModeSelection
