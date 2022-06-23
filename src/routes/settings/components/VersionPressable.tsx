import React, { useState } from 'react'
import { getVersion } from 'react-native-device-info'
import styled from 'styled-components/native'

import { ContentSecondary } from '../../../components/text/Content'
import labels from '../../../constants/labels.json'

const Version = styled.Pressable`
  position: absolute;
  bottom: 0;
  padding: ${props => props.theme.spacings.xl} ${props => props.theme.spacings.md};
`

interface PropsType {
  setVisible: () => void
}

export const CLICKS_TO_THROW_SENTRY_ERROR = 10

const VersionPressable = ({ setVisible }: PropsType): JSX.Element => {
  const [counter, setCounter] = useState<number>(0)

  const onPress = () => {
    if (counter >= CLICKS_TO_THROW_SENTRY_ERROR) {
      setCounter(0)
      setVisible()
    }
    setCounter(oldVal => oldVal + 1)
  }

  return (
    <Version onPress={onPress}>
      <ContentSecondary>
        {labels.settings.version}: {getVersion()}
      </ContentSecondary>
    </Version>
  )
}

export default VersionPressable
