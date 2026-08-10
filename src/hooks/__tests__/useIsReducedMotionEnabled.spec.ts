import { act, renderHook, waitFor } from '@testing-library/react-native'
import { AccessibilityInfo, EmitterSubscription } from 'react-native'

import useIsReducedMotionEnabled from '../useIsReducedMotionEnabled'

type ReduceMotionHandler = (isReduceMotionEnabled: boolean) => void

describe('useIsReducedMotionEnabled', () => {
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

  describe('when the setting is disabled', () => {
    it('should report that motion is not reduced', async () => {
      mockAccessibilityInfo(false)

      const { result } = renderHook(() => useIsReducedMotionEnabled())

      await waitFor(() => expect(result.current).toBe(false))
    })
  })

  describe('when the setting is enabled', () => {
    it('should report that motion is reduced', async () => {
      mockAccessibilityInfo(true)

      const { result } = renderHook(() => useIsReducedMotionEnabled())

      await waitFor(() => expect(result.current).toBe(true))
    })
  })

  describe('when the setting is toggled while running', () => {
    it('should report the new value without a restart', async () => {
      mockAccessibilityInfo(false)

      const { result } = renderHook(() => useIsReducedMotionEnabled())
      await waitFor(() => expect(result.current).toBe(false))

      act(() => notifyReduceMotionChanged(true))

      expect(result.current).toBe(true)
    })
  })

  it('should stop listening when unmounted', async () => {
    mockAccessibilityInfo(false)

    const { unmount } = renderHook(() => useIsReducedMotionEnabled())
    await waitFor(() => expect(AccessibilityInfo.addEventListener).toHaveBeenCalled())

    unmount()

    expect(removeListener).toHaveBeenCalled()
  })
})
