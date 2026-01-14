import React, { ReactElement, useState } from 'react'
import styled from 'styled-components/native'

import { MicrophoneIcon } from '../../../../assets/images'

const RecordingButtonContainer = styled.Pressable<{ pressed: boolean }>`
  border-radius: 50%;
  padding: ${props => props.theme.spacings.sm};

  background-color: ${props => props.theme.colors.lightGreyBackground};
  opacity: ${props => (props.pressed ? props.theme.styles.pressOpacity.min : props.theme.styles.pressOpacity.max)};
`

type RecordingButtonProps = {
  onPressIn: () => void
  onPressOut: () => void
}

const RecordingButton = ({ onPressIn, onPressOut }: RecordingButtonProps): ReactElement => {
  const [pressed, setPressed] = useState(false)

  return (
    <RecordingButtonContainer
      onPressIn={() => {
        setPressed(!pressed)
        onPressIn()
      }}
      onPressOut={() => {
        setPressed(!pressed)
        onPressOut()
      }}
      pressed={pressed}>
      <MicrophoneIcon width={32} height={32} />
    </RecordingButtonContainer>
  )
}

export default RecordingButton
