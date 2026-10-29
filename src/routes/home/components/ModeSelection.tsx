import React, { ReactElement } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { BookIcon, TargetIcon } from '../../../../assets/images'
import Button from '../../../components/Button'
import { Content } from '../../../components/text/Content'
import { Heading } from '../../../components/text/Heading'
import { BUTTONS_THEME } from '../../../constants/data'
import { Color } from '../../../constants/theme/colors'
import { darkenUntilContrast, MIN_CONTRAST_RATIO } from '../../../constants/theme/contrast'
import useLoadProgress from '../../../hooks/useLoadProgress'
import Job from '../../../models/Job'
import { getLabels, pluralize } from '../../../services/helpers'

// TODO: Remove SHOW_NEW_BADGE_UNTIL and isNewBadgeVisible after 2026-06-01
const SHOW_NEW_BADGE_UNTIL = new Date('2026-06-01')
const isNewBadgeVisible = new Date() < SHOW_NEW_BADGE_UNTIL

const Container = styled.View`
  gap: ${props => props.theme.spacings.sm};
  padding: ${props => props.theme.spacings.md} 0;
`

const CardContainer = styled.View<{ backgroundColor: string }>`
  flex-grow: 1;
  background-color: ${props => props.backgroundColor};
  border-radius: ${props => props.theme.spacings.sm};
  padding: ${props => props.theme.spacings.sm};
`

const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${props => props.theme.spacings.xs};
  padding-bottom: ${props => props.theme.spacings.md};
`

const IconBackground = styled.View`
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 30%;
  padding: ${props => props.theme.spacings.xs};
`

const CardTitle = styled(Heading)<{ textColor: Color }>`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  color: ${props => props.textColor};
`

const Subtitle = styled(Content)<{ textColor: Color }>`
  color: ${props => props.textColor};
`

const ProgressRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

const SmallContent = styled(Content)`
  font-size: ${props => props.theme.fonts.smallFontSize};
`

const ProgressBarTrack = styled.View`
  background-color: ${props => props.theme.colors.progressTrack};
  border-radius: ${props => props.theme.spacings.xs};
  height: ${props => props.theme.spacings.xs};
`

const ProgressBar = styled.View<{ progress: number; color: Color }>`
  background-color: ${props => props.color};
  width: ${props => (Number.isFinite(props.progress) ? props.progress * 100 : 0)}%;
  height: 100%;
  border-radius: ${props => props.theme.spacings.xs};
`

const NewBadge = styled.View`
  background-color: ${props => props.theme.colors.backgroundTraining};
  border-radius: ${props => props.theme.spacings.sm};
  padding: ${props => props.theme.spacings.xxs} ${props => props.theme.spacings.xs};
`

const NewBadgeText = styled(Content)`
  color: ${props => props.theme.colors.textOnTrainingCard};
  font-size: ${props => props.theme.fonts.smallFontSize};
`

const ContentBox = styled.View`
  background-color: ${props => props.theme.colors.backgroundAccent};
  border-radius: ${props => props.theme.spacings.sm};
  gap: ${props => props.theme.spacings.xs};
  padding: ${props => props.theme.spacings.sm};
  padding-bottom: 0;
`

const BadgeRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const StartButton = styled(Button)<{ backgroundColor: string }>`
  align-self: flex-start;
  background-color: ${props => props.backgroundColor};
`

type LearningCardProps = {
  numberUnits: number
  unitsCompleted: number
  color: Color
  onPress: () => void
}

const LearningCard = ({ numberUnits, unitsCompleted, color, onPress }: LearningCardProps): ReactElement => {
  const labels = getLabels()
  const theme = useTheme()
  const textColor = theme.colors.textOnLearningCard
  const progressColor = darkenUntilContrast(color, theme.colors.progressTrack, MIN_CONTRAST_RATIO)
  return (
    <CardContainer backgroundColor={color}>
      <TitleRow>
        <IconBackground>
          <BookIcon color={textColor} />
        </IconBackground>
        <View>
          <CardTitle textColor={textColor}>{labels.home.learnVocabulary}</CardTitle>
          <Subtitle textColor={textColor}>{labels.home.learnVocabularyDescription}</Subtitle>
        </View>
      </TitleRow>
      <ContentBox>
        <ProgressRow>
          <SmallContent>{labels.home.progress}</SmallContent>
          <SmallContent>
            {unitsCompleted}/{numberUnits} {pluralize(labels.general.unit, numberUnits)}
          </SmallContent>
        </ProgressRow>
        <ProgressBarTrack>
          <ProgressBar testID='learning-progress-bar' progress={unitsCompleted / numberUnits} color={progressColor} />
        </ProgressBarTrack>
        <StartButton
          testID='start-learning-button'
          onPress={onPress}
          label={labels.home.startExercise}
          buttonTheme={BUTTONS_THEME.contained}
          fitToContentWidth
          backgroundColor={theme.colors.backgroundLearning}
          textColor={textColor}
        />
      </ContentBox>
    </CardContainer>
  )
}

type TrainingCardProps = {
  onPress: () => void
}

const TrainingCard = ({ onPress }: TrainingCardProps): ReactElement => {
  const labels = getLabels().home
  const theme = useTheme()
  const textColor = theme.colors.textOnTrainingCard
  return (
    <CardContainer backgroundColor={theme.colors.backgroundTraining}>
      <TitleRow>
        <IconBackground>
          <TargetIcon color={textColor} />
        </IconBackground>
        <View>
          <CardTitle textColor={textColor}>{labels.trainVocabulary}</CardTitle>
          <Subtitle textColor={textColor}>{labels.testYourKnowledge}</Subtitle>
        </View>
      </TitleRow>
      <ContentBox>
        <BadgeRow>
          <Content>{labels.readyToPractice}</Content>
          {isNewBadgeVisible && (
            <NewBadge>
              <NewBadgeText>{labels.new}</NewBadgeText>
            </NewBadge>
          )}
        </BadgeRow>
        <StartButton
          testID='start-training-button'
          onPress={onPress}
          label={labels.startExercise}
          buttonTheme={BUTTONS_THEME.contained}
          fitToContentWidth
          backgroundColor={theme.colors.backgroundTraining}
          textColor={textColor}
        />
      </ContentBox>
    </CardContainer>
  )
}

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
  const theme = useTheme()
  const completedUnits = Math.floor((progress ?? 0) * job.numberOfUnits)

  return (
    <Container>
      <LearningCard
        numberUnits={job.numberOfUnits}
        unitsCompleted={completedUnits}
        color={theme.colors.backgroundLearning}
        onPress={navigateToJob}
      />
      <TrainingCard onPress={navigateToTrainingExerciseSelection} />
    </Container>
  )
}

export default ModeSelection
