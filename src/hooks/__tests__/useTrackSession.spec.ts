import { act, renderHook } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import { AppState, AppStateStatus } from 'react-native'

import { trackEvent } from '../../services/AnalyticsService'
import { getCurrentSessionId, rotateSessionId } from '../../services/SessionService'
import useTrackSession from '../useTrackSession'

jest.mock('../../services/AnalyticsService', () => ({
  trackEvent: jest.fn(),
}))

jest.mock('../../services/SessionService', () => ({
  getCurrentSessionId: jest.fn(() => 'session-1'),
  rotateSessionId: jest.fn(),
}))

jest.mock('../useStorage', () => ({
  useStorageCache: jest.fn(() => 'mockStorageCache'),
}))

describe('useTrackSession', () => {
  let changeHandler: ((state: AppStateStatus) => void) | null = null
  const mockRemove = jest.fn()

  beforeEach(() => {
    changeHandler = null
    jest.spyOn(AppState, 'addEventListener').mockImplementation((_type, handler) => {
      changeHandler = handler as (state: AppStateStatus) => void
      return { remove: mockRemove } as ReturnType<typeof AppState.addEventListener>
    })
    jest.clearAllMocks()
  })

  it('should track session_start on mount when app is active', () => {
    AppState.currentState = 'active'
    renderHook(useTrackSession)

    expect(trackEvent).toHaveBeenCalledWith('mockStorageCache', {
      type: 'session_start',
      session_id: 'session-1',
    })
  })

  it('should not track anything on mount when app is in background', () => {
    AppState.currentState = 'background'
    renderHook(useTrackSession)

    expect(trackEvent).not.toHaveBeenCalled()
  })

  it('should track session_start when transitioning from background to active', () => {
    AppState.currentState = 'background'
    renderHook(useTrackSession)

    act(() => changeHandler!('active'))
    expect(trackEvent).toHaveBeenCalledWith('mockStorageCache', {
      type: 'session_start',
      session_id: 'session-1',
    })
  })

  it('should track session_end and rotate session ID when transitioning to background', () => {
    mocked(getCurrentSessionId)
      .mockReturnValueOnce('session-1')
      .mockReturnValueOnce('session-1')
      .mockReturnValueOnce('session-2')
      .mockReturnValueOnce('session-2')
    AppState.currentState = 'active'
    renderHook(useTrackSession)

    expect(trackEvent).toHaveBeenCalledWith('mockStorageCache', {
      type: 'session_start',
      session_id: 'session-1',
    })
    act(() => changeHandler!('background'))
    expect(trackEvent).toHaveBeenCalledWith('mockStorageCache', {
      type: 'session_end',
      session_id: 'session-1',
    })
    expect(rotateSessionId).toHaveBeenCalledTimes(1)
    act(() => changeHandler!('active'))
    expect(trackEvent).toHaveBeenCalledWith('mockStorageCache', {
      type: 'session_start',
      session_id: 'session-2',
    })
    act(() => changeHandler!('background'))
    expect(trackEvent).toHaveBeenCalledWith('mockStorageCache', {
      type: 'session_end',
      session_id: 'session-2',
    })
    expect(rotateSessionId).toHaveBeenCalledTimes(2)
  })

  it('should ignore inactive state changes', () => {
    AppState.currentState = 'background'
    renderHook(useTrackSession)

    act(() => changeHandler!('inactive'))
    expect(trackEvent).not.toHaveBeenCalled()
  })

  it('should remove subscription on unmount', () => {
    AppState.currentState = 'background'
    const { unmount } = renderHook(useTrackSession)

    unmount()
    expect(mockRemove).toHaveBeenCalled()
  })
})
