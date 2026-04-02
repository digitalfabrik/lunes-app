import React, { ReactElement } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { BookIcon, TargetIcon } from '../../../../assets/images'
import Button from '../../../components/Button'
import PressableOpacity from '../../../components/PressableOpacity'
import { Content } from '../../../components/text/Content'
import { Heading } from '../../../components/text/Heading'
import { BUTTONS_THEME } from '../../../constants/data'
import { Color, COLORS } from '../../../constants/theme/colors'
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

const CardTitle = styled(Heading)`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  color: ${props => props.theme.colors.background};
`

const Subtitle = styled(Content)`
  color: ${props => props.theme.colors.background};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
`

const ProgressRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

const SmallContent = styled(Content)`
  font-size: ${props => props.theme.fonts.smallFontSize};
`

const ProgressBarTrack = styled.View`
  background-color: rgba(123, 142, 255, 0.2);
  border-radius: ${props => props.theme.spacings.xs};
  height: ${props => props.theme.spacings.xs};
`

const ProgressBar = styled.View<{ progress: number }>`
  background-color: ${COLORS.backgroundBlue};
  width: ${props => (Number.isFinite(props.progress) ? props.progress * 100 : 0)}%;
  height: 100%;
  border-radius: ${props => props.theme.spacings.xs};
`

const NewBadge = styled.View`
  background-color: ${props => props.theme.colors.backgroundTeal};
  border-radius: ${props => props.theme.spacings.sm};
  padding: ${props => props.theme.spacings.xxs} ${props => props.theme.spacings.xs};
`

const NewBadgeText = styled(Content)`
  color: ${props => props.theme.colors.background};
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

type LearningCardProps = {
  numberUnits: number
  unitsCompleted: number
  color: Color
  onPress: () => void
}

const LearningCard = ({ numberUnits, unitsCompleted, color, onPress }: LearningCardProps): ReactElement => {
  const labels = getLabels()
  return (
    <PressableOpacity onPress={onPress}>
      <CardContainer backgroundColor={color}>
        <TitleRow>
          <IconBackground>
            <BookIcon fill={COLORS.background} />
          </IconBackground>
          <View>
            <CardTitle>{labels.home.learnVocabulary}</CardTitle>
            <Subtitle>{labels.home.learnVocabularyDescription}</Subtitle>
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
            <ProgressBar progress={unitsCompleted / numberUnits} />
          </ProgressBarTrack>
          <Button
            onPress={onPress}
            label={labels.home.startExercise}
            buttonTheme={BUTTONS_THEME.contained}
            fitToContentWidth
            style={{ backgroundColor: COLORS.backgroundBlue, alignSelf: 'flex-start' }}
          />
        </ContentBox>
      </CardContainer>
    </PressableOpacity>
  )
}

type TrainingCardProps = {
  onPress: () => void
}

const TrainingCard = ({ onPress }: TrainingCardProps): ReactElement => {
  const labels = getLabels().home
  return (
    <PressableOpacity onPress={onPress}>
      <CardContainer backgroundColor={COLORS.backgroundTeal}>
        <TitleRow>
          <IconBackground>
            <TargetIcon fill={COLORS.background} />
          </IconBackground>
          <View>
            <CardTitle>{labels.trainVocabulary}</CardTitle>
            <Subtitle>{labels.testYourKnowledge}</Subtitle>
          </View>
        </TitleRow>
        <ContentBox>
          <BadgeRow>
            <View>
              <SmallContent>{labels.readyToPractice}</SmallContent>
              <Content>{labels.newVocabulary}</Content>
            </View>
            {isNewBadgeVisible && (
              <NewBadge>
                <NewBadgeText>{labels.new}</NewBadgeText>
              </NewBadge>
            )}
          </BadgeRow>
          <Button
            onPress={onPress}
            label={labels.startExercise}
            buttonTheme={BUTTONS_THEME.contained}
            fitToContentWidth
            style={{ alignSelf: 'flex-start', backgroundColor: COLORS.backgroundTeal }}
          />
        </ContentBox>
      </CardContainer>
    </PressableOpacity>
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
  const completedUnits = Math.floor((progress ?? 0) * job.numberOfUnits)

  return (
    <Container>
      <LearningCard
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
