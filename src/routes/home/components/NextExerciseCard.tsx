import React, { ReactElement } from 'react'
import { Pressable, TouchableOpacity } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { ArrowRightCircleIconWhite } from '../../../../assets/images'
import { ContentTextLight } from '../../../components/text/Content'
import { SubheadingPrimary, SubheadingText } from '../../../components/text/Subheading'

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
  align-self: center;
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
  height: ${wp('19%')}px;
  width: ${wp('18%')}px;
  align-self: center;
`

const Heading = styled(SubheadingText)`
  font-size: ${props => props.theme.fonts.smallFontSize};
`
const Subheading = styled(ContentTextLight)`
  font-size: ${props => props.theme.fonts.smallFontSize};
`

interface NextExerciseCardProps {
  thumbnail: string
  heading: string
  subheading: string
  buttonLabel: string
  onPress: () => void
}

const NextExerciseCard: React.FC<NextExerciseCardProps> = ({
  thumbnail,
  onPress,
  heading,
  subheading,
  buttonLabel
}: NextExerciseCardProps): ReactElement => (
  <Pressable onPress={onPress}>
    <NextExerciseContainer>
      <Thumbnail source={{ uri: thumbnail }} />
      <ExerciseDetail>
        <Heading>{heading}</Heading>
        <Subheading>{subheading}</Subheading>
        <ActionContainer>
          <TouchableOpacity style={{ flexDirection: 'row' }} onPress={onPress}>
            <Label>{buttonLabel}</Label>
            <ArrowRightCircleIconWhite width={wp('8%')} height={wp('8%')} />
          </TouchableOpacity>
        </ActionContainer>
      </ExerciseDetail>
    </NextExerciseContainer>
  </Pressable>
)

export default NextExerciseCard
