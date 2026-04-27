import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { MicrophoneIcon } from '../../../../assets/images'

const Button = styled.Pressable<{ isRecording: boolean }>`
  border-radius: 50%;
  padding: ${props => props.theme.spacings.md};
  background-color: ${props =>
    props.isRecording ? props.theme.colors.primary : props.theme.colors.backgroundLightGrey};
  color: ${props => (props.isRecording ? props.theme.colors.backgroundAccent : props.theme.colors.text)};
`

type RecordingButtonProps = {
  onPressIn: () => void
  onPressOut: () => void
  isRecording: boolean
  accessibilityLabel: string
}

const RecordingButton = ({
  onPressIn,
  onPressOut,
  isRecording,
  accessibilityLabel,
}: RecordingButtonProps): ReactElement => (
  <Button
    onPressIn={onPressIn}
    onPressOut={onPressOut}
    isRecording={isRecording}
    accessibilityRole='button'
    accessibilityLabel={accessibilityLabel}
    testID='recording-button'
  >
    <MicrophoneIcon width={40} height={40} />
  </Button>
)

export default RecordingButton
