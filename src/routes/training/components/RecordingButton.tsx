import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { MicrophoneIcon } from '../../../../assets/images'

const RecordingButtonContainer = styled.Pressable<{ pressed: boolean }>`
  border-radius: 50%;
  padding: ${props => props.theme.spacings.sm};

  background-color: ${props => props.theme.colors.lightGreyBackground};
  opacity: ${props => (props.pressed ? props.theme.styles.pressOpacity.min : props.theme.styles.pressOpacity.max)};
`

type RecordingButtonProps = {
  onPress: () => void
  isRecording: boolean
}

const RecordingButton = ({ onPress, isRecording }: RecordingButtonProps): ReactElement => (
  <RecordingButtonContainer
    onPress={() => {
      onPress()
    }}
    pressed={isRecording}>
    <MicrophoneIcon width={32} height={32} />
  </RecordingButtonContainer>
)

export default RecordingButton
