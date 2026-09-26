import { StackNavigationProp } from '@react-navigation/stack'
import { useState } from 'react'

import { InvalidContentAreaCodeError } from '../constants/endpoints'
import { RoutesParams } from '../navigation/NavigationTypes'
import { redeemContentAreaCode } from '../services/ContentAreaService'
import { getLabels } from '../services/helpers'
import { reportError } from '../services/sentry'
import { useStorageCache } from './useStorage'

type Return = {
  redeem: (code: string) => Promise<void>
  errorMessage: string
  isRedeeming: boolean
}

const useRedeemContentArea = (
  navigation: StackNavigationProp<RoutesParams, 'Activation' | 'ActivationCodeEntry'>,
): Return => {
  const storageCache = useStorageCache()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isRedeeming, setIsRedeeming] = useState<boolean>(false)

  const redeem = async (code: string): Promise<void> => {
    const { error: errorLabels } = getLabels().activation
    setErrorMessage('')
    setIsRedeeming(true)
    try {
      const contentArea = await redeemContentAreaCode(storageCache, code)
      navigation.replace('JobSelection', {
        initialSelection: false,
        jobScope: { type: 'contentArea', token: contentArea.token },
      })
    } catch (error) {
      if (error instanceof Error && error.message === InvalidContentAreaCodeError) {
        setErrorMessage(errorLabels.wrongCode)
      } else {
        reportError(error)
        setErrorMessage(errorLabels.technical)
      }
    } finally {
      setIsRedeeming(false)
    }
  }

  return { redeem, errorMessage, isRedeeming }
}

export default useRedeemContentArea
