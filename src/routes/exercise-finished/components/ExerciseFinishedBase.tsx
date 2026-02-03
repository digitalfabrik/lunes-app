import React, { ComponentType, ReactElement } from 'react'
import * as Progress from 'react-native-progress'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { SvgProps } from 'react-native-svg'
import styled from 'styled-components/native'

import { CloseIconWhite } from '../../../../assets/images'
import PressableOpacity from '../../../components/PressableOpacity'
import RoundedBackground from '../../../components/RoundedBackground'
import { Content } from '../../../components/text/Content'
import { HeadingBackground } from '../../../components/text/Heading'
import theme from '../../../constants/theme'
import { Color } from '../../../constants/theme/colors'
import { getLabels, wordsDescription } from '../../../services/helpers'

const Root = styled.View`
  background-color: ${prop => prop.theme.colors.background};
  height: 100%;
  align-items: center;
`

const MessageContainer = styled.View`
  width: 60%;
  margin-top: ${props => props.theme.spacings.sm};
  align-items: center;
`
const Message = styled(HeadingBackground)<{ unlockedNextExercise: boolean }>`
  color: ${prop => (prop.unlockedNextExercise ? prop.theme.colors.primary : prop.theme.colors.background)};
  text-align: center;
`

const AlignRight = styled.View`
  width: 100%;
  flex-direction: row-reverse;
`

const IconButton = styled(PressableOpacity)`
  padding: ${props => props.theme.spacings.xs};
`

const Results = styled(Content)<{ color: Color }>`
  color: ${props => props.color};
  padding: ${props => props.theme.spacings.md} 0 ${props => props.theme.spacings.xs};
`

type ExerciseFinishedBaseProps = {
  results: { correct: number; total: number }
  feedbackColor: Color
  unlockedNewExercise: boolean
  FeedbackIcon: ComponentType<SvgProps>
  message: string
  onBack: () => void
  children: ReactElement[] | ReactElement
}

const ExerciseFinishedBase = ({
  results,
  feedbackColor,
  message,
  FeedbackIcon,
  unlockedNewExercise,
  onBack,
  children,
}: ExerciseFinishedBaseProps): ReactElement => (
  <Root>
    <RoundedBackground color={unlockedNewExercise ? theme.colors.correct : theme.colors.primary}>
      <AlignRight>
        <IconButton onPress={onBack}>
          <CloseIconWhite width={hp('3%')} height={hp('3%')} />
        </IconButton>
      </AlignRight>
      <FeedbackIcon width={hp('5%')} height={hp('5%')} />
      <MessageContainer>
        <Message unlockedNextExercise={unlockedNewExercise}>{message}</Message>
        <Results color={feedbackColor}>
          {results.correct} {getLabels().results.of} {wordsDescription(results.total)} {getLabels().results.correct}
        </Results>
        <Progress.Bar
          color={feedbackColor}
          progress={results.correct / results.total}
          unfilledColor={theme.colors.background}
          borderWidth={0}
        />
      </MessageContainer>
    </RoundedBackground>

    {children}
  </Root>
)

export default ExerciseFinishedBase
