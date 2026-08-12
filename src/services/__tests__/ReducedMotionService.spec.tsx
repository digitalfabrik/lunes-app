import { act, renderHook, waitFor } from '@testing-library/react-native'
import React, { ReactElement } from 'react'
import { AccessibilityInfo, EmitterSubscription } from 'react-native'

import useIsReducedMotionEnabled from '../../hooks/useIsReducedMotionEnabled'
import ReducedMotionServiceProvider from '../ReducedMotionService'

type ReduceMotionHandler = (isReduceMotionEnabled: boolean) => void

describe('ReducedMotionService', () => {
  const removeListener = jest.fn()
  let notifyReduceMotionChanged: ReduceMotionHandler

  const mockAccessibilityInfo = (isEnabledInitially: boolean): void => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(isEnabledInitially)
    // The signature is cast because addEventListener is overloaded for every accessibility event
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockImplementation((_eventName, handler) => {
      notifyReduceMotionChanged = handler as unknown as ReduceMotionHandler
      return { remove: removeListener } as unknown as EmitterSubscription
    })
  }

  const wrapper = ({ children }: { children: ReactElement }): ReactElement => (
    <ReducedMotionServiceProvider>{children}</ReducedMotionServiceProvider>
  )

  const renderReducedMotionHook = () => renderHook(() => useIsReducedMotionEnabled(), { wrapper })

  describe('when the setting is disabled', () => {
    it('should report that motion is not reduced', async () => {
      mockAccessibilityInfo(false)

      const { result } = renderReducedMotionHook()

      await waitFor(() => expect(result.current).toBe(false))
    })
  })

  describe('when the setting is enabled', () => {
    it('should report that motion is reduced', async () => {
      mockAccessibilityInfo(true)

      const { result } = renderReducedMotionHook()

      await waitFor(() => expect(result.current).toBe(true))
    })
  })

  describe('when the setting is toggled while running', () => {
    it('should report the new value without a restart', async () => {
      mockAccessibilityInfo(false)

      const { result } = renderReducedMotionHook()
      await waitFor(() => expect(result.current).toBe(false))

      act(() => notifyReduceMotionChanged(true))

      expect(result.current).toBe(true)
    })
  })

  describe('when several components read the setting', () => {
    it('should subscribe to the accessibility info only once', async () => {
      mockAccessibilityInfo(true)

      const { result } = renderHook(() => [useIsReducedMotionEnabled(), useIsReducedMotionEnabled()], { wrapper })

      await waitFor(() => expect(result.current).toEqual([true, true]))
      expect(AccessibilityInfo.addEventListener).toHaveBeenCalledTimes(1)
    })
  })

  it('should stop listening when unmounted', async () => {
    mockAccessibilityInfo(false)

    const { unmount } = renderReducedMotionHook()
    await waitFor(() => expect(AccessibilityInfo.addEventListener).toHaveBeenCalled())

    unmount()

    expect(removeListener).toHaveBeenCalled()
  })
})
