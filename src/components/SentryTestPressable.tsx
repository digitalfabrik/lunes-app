import React, { ReactElement, useState } from 'react'
import { Pressable } from 'react-native'

import { reportError } from '../services/sentry'

interface Props {
  children: ReactElement
}

const SentryTestPressable = ({ children }: Props): ReactElement => {
  const [counter, setCounter] = useState<number>(0)
  const CLICKS_TO_ENABLE_SENTRY = 20

  const onPress = () => {
    if (counter > CLICKS_TO_ENABLE_SENTRY) {
      reportError('Error for testing Sentry')
      setCounter(0)
    }
    setCounter(oldVal => oldVal + 1)
  }

  return <Pressable onPress={onPress}>{children}</Pressable>
}

export default SentryTestPressable
