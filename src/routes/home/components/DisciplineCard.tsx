import React, { ReactElement, useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import * as Progress from 'react-native-progress'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { ArrowRightCircleIconWhite } from '../../../../assets/images'
import Button from '../../../components/Button'
import { ContentSecondary, ContentTextLight } from '../../../components/text/Content'
import { Subheading, SubheadingPrimary, SubheadingText } from '../../../components/text/Subheading'
import { BUTTONS_THEME } from '../../../constants/data'
import { Discipline, Document } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import theme from '../../../constants/theme'
import { useLoadDiscipline } from '../../../hooks/useLoadDiscipline'
import { loadDocuments } from '../../../hooks/useLoadDocuments'
import useReadNextExercise from '../../../hooks/useReadNextExercise'
import useReadProgress from '../../../hooks/useReadProgress'
import { childrenLabel } from '../../../services/helpers'
import { reportError } from '../../../services/sentry'
import Card from './Card'

const ProgressContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacings.sm} 0 ${props => props.theme.spacings.xs};
`

const NumberText = styled(Subheading)`
  font-size: ${props => props.theme.fonts.headingFontSize};
  padding: ${props => props.theme.spacings.xs};
`

const UnitText = styled(ContentSecondary)`
  font-size: ${props => props.theme.fonts.headingFontSize};
`

const ButtonContainer = styled.View`
  margin: ${props => props.theme.spacings.xxs} auto;
`

const NextExerciseContainer = styled.View`
  flex-direction: row;
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacings.sm};
  margin: ${props => props.theme.spacings.sm} 0;
  shadow-color: ${props => props.theme.colors.shadow};
  elevation: 8;
  shadow-radius: 1px;
  shadow-offset: 1px 1px;
  shadow-opacity: 0.5;
`

const ExerciseDetail = styled.View`
  padding: 0 ${props => props.theme.spacings.sm};
`

const ActionContainer = styled.View`
  padding-top: ${props => props.theme.spacings.xs};
  flex-direction: row;
  align-items: flex-start;
`

const Label = styled(SubheadingPrimary)`
  letter-spacing: ${props => props.theme.fonts.capsLetterSpacing};
  text-transform: uppercase;
  padding-right: ${props => props.theme.spacings.xs};
  align-self: center;
`

const Thumbnail = styled.Image`
  height: 90px;
  width: 75px;
  align-self: center;
`

interface PropsType {
  disciplineId: number
  onPress: (profession: Discipline) => void
  navigateToNextExercise: (
    disciplineId: number,
    exerciseKey: number,
    disciplineTitle: string,
    documents: Document[]
  ) => void
}

// TODO remove labels.home.continue, move ExerciseContainer to separate component, fix tests

const DisciplineCard = (props: PropsType): ReactElement => {
  const { disciplineId, onPress, navigateToNextExercise } = props
  const { data: discipline } = useLoadDiscipline(disciplineId)
  const { data: nextExercise } = useReadNextExercise(discipline)
  const { data: progress } = useReadProgress(discipline)
  const moduleAlreadyStarted = progress !== null && progress !== 0
  const [documents, setDocuments] = useState<Document[] | null>(null)

  useEffect(() => {
    if (nextExercise) {
      loadDocuments({ disciplineId: nextExercise.disciplineId })
        .then(data => {
          setDocuments(data)
        })
        .catch(reportError)
    }
  }, [nextExercise])

  const navigate = () => {
    if (documents !== null && nextExercise !== null) {
      navigateToNextExercise(
        nextExercise.disciplineId,
        nextExercise.exerciseKey,
        nextExercise.disciplineTitle,
        documents
      )
    }
  }

  if (!discipline) {
    // TODO LUN-301 handle loading
    return <></>
  }

  return (
    <Card heading={discipline.title} icon={discipline.icon}>
      <>
        <ProgressContainer>
          <Progress.Circle
            progress={(progress ?? 0) / discipline.numberOfChildren}
            size={50}
            indeterminate={false}
            color={theme.colors.progressIndicator}
            unfilledColor={theme.colors.disabled}
            borderWidth={0}
            thickness={6}
            testID='progress-circle'
          />
          <NumberText>
            {moduleAlreadyStarted && `${progress}/`}
            {discipline.numberOfChildren}
          </NumberText>
          <UnitText>{moduleAlreadyStarted ? labels.home.progressDescription : childrenLabel(discipline)}</UnitText>
        </ProgressContainer>
        {documents && documents.length > 0 && (
          <NextExerciseContainer>
            <Thumbnail source={{ uri: documents[0].document_image[0].image }} />
            <ExerciseDetail>
              <SubheadingText>
                {labels.home.level} {nextExercise?.exerciseKey}
              </SubheadingText>
              <ContentTextLight>{nextExercise?.disciplineTitle}</ContentTextLight>
              <ActionContainer>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={navigate}>
                  <Label>{labels.home.continue}</Label>
                  <ArrowRightCircleIconWhite width={wp('8%')} height={wp('8%')} />
                </TouchableOpacity>
              </ActionContainer>
            </ExerciseDetail>
          </NextExerciseContainer>
        )}
        <ButtonContainer>
          <Button
            onPress={() => onPress(discipline)}
            label={labels.home.checkModules}
            buttonTheme={BUTTONS_THEME.outlined}
            disabled={documents === null || nextExercise === null}
          />
        </ButtonContainer>
      </>
    </Card>
  )
}

export default DisciplineCard
