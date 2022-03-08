import React, { ReactElement, useState } from 'react'
import { Pressable } from 'react-native'

import { reportError } from '../services/sentry'

interface Props {
  children: ReactElement
}

const SentryTestPressable = ({ children }: Props): ReactElement => {
  const [counter, setCounter] = useState<number>(0)
  const CLICKS_TO_THROW_SENTRY_ERROR = 20

  const onPress = () => {
    if (counter > CLICKS_TO_THROW_SENTRY_ERROR) {
      setCounter(0)
      reportError('Error for testing Sentry')
      throw Error('This error was thrown for testing purposes. Please ignore this error.')
    }
    setCounter(oldVal => oldVal + 1)
  }

  return <Pressable onPress={onPress}>{children}</Pressable>
}

export default SentryTestPressable
