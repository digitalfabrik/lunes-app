import React, { ReactElement } from 'react'
import * as Progress from 'react-native-progress'
import styled from 'styled-components/native'

import Button from '../../../components/Button'
import { ContentSecondary } from '../../../components/text/Content'
import { Subheading } from '../../../components/text/Subheading'
import { BUTTONS_THEME } from '../../../constants/data'
import { Discipline } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import theme from '../../../constants/theme'
import useReadProgress from '../../../hooks/useReadProgress'
import { childrenLabel } from '../../../services/helpers'
import Card from './Card'

const ProgressContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacings.sm} 0;
`

const ProgressText = styled(Subheading)`
  font-size: ${props => props.theme.fonts.headingFontSize};
  padding: ${props => props.theme.spacings.xs};
`

const ProgressUnit = styled(ContentSecondary)`
  font-size: ${props => props.theme.fonts.headingFontSize};
`

const ButtonContainer = styled.View`
  margin: ${props => props.theme.spacings.sm} auto;
`

interface PropsType {
  discipline: Discipline
  showProgress: boolean
  onPress?: (profession: Discipline) => void
  navigateToNextExercise: (profession: Discipline) => void
}

const DisciplineCard = (props: PropsType): ReactElement => {
  const { discipline, showProgress, onPress, navigateToNextExercise } = props
  const { data: progress } = useReadProgress(discipline)

  const navigate = () => {
    navigateToNextExercise(discipline) // TODO LUN-290 add progress
  }

  const onPressProfession = () => {
    if (onPress) {
      onPress(discipline)
    }
  }

  return (
    <Card heading={discipline.title} icon={discipline.icon} onPress={onPressProfession}>
      <>
        <ProgressContainer>
          {showProgress && (
            <Progress.Circle
              progress={(progress ?? 0) / discipline.numberOfChildren}
              size={50}
              indeterminate={false}
              color={theme.colors.progressIndicator}
              unfilledColor={theme.colors.disabled}
              borderWidth={0}
              thickness={6}
            />
          )}

          <ProgressText>
            {showProgress && progress !== null && `${progress}/`}
            {discipline.numberOfChildren}
          </ProgressText>
          <ProgressUnit>{showProgress ? labels.home.progressDescription : childrenLabel(discipline)}</ProgressUnit>
        </ProgressContainer>
        <ButtonContainer>
          <Button
            onPress={navigate}
            label={progress === 0 ? labels.home.start : labels.home.continue}
            buttonTheme={BUTTONS_THEME.outlined}
          />
        </ButtonContainer>
      </>
    </Card>
  )
}

export default DisciplineCard
