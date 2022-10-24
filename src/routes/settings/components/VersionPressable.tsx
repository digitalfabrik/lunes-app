import React, { useState } from 'react'
import { getVersion } from 'react-native-device-info'
import styled from 'styled-components/native'

import { ContentSecondary } from '../../../components/text/Content'
import { getLabels } from '../../../services/helpers'

const Version = styled.Pressable`
  position: absolute;
  bottom: 0;
  padding: ${props => props.theme.spacings.xl} ${props => props.theme.spacings.md};
`

interface VersionPressableProps {
  onClickThresholdReached: () => void
}

export const CLICK_THRESHOLD = 10

const VersionPressable = ({ onClickThresholdReached }: VersionPressableProps): JSX.Element => {
  const [counter, setCounter] = useState<number>(0)

  const onPress = () => {
    if (counter >= CLICK_THRESHOLD) {
      setCounter(0)
      onClickThresholdReached()
    }
    setCounter(oldVal => oldVal + 1)
  }

  return (
    <Version onPress={onPress}>
      <ContentSecondary>
        {getLabels().settings.version}: {getVersion()}
      </ContentSecondary>
    </Version>
  )
}

export default VersionPressable
