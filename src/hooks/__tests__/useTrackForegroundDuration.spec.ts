import { act, renderHook } from '@testing-library/react-native'
import { AppState, AppStateStatus } from 'react-native'

import useTrackForegroundDuration from '../useTrackForegroundDuration'

describe('useTrackForegroundDuration', () => {
  let changeHandler: ((state: AppStateStatus) => void) | null = null
  const mockRemove = jest.fn()

  beforeEach(() => {
    changeHandler = null
    jest.spyOn(AppState, 'addEventListener').mockImplementation((_type, handler) => {
      changeHandler = handler as (state: AppStateStatus) => void
      return { remove: mockRemove } as ReturnType<typeof AppState.addEventListener>
    })
    AppState.currentState = 'active'
    jest.clearAllMocks()
  })

  it('should call onUnmount with foreground duration in seconds', () => {
    const onUnmount = jest.fn()
    jest.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(6000)

    const { unmount } = renderHook(() => useTrackForegroundDuration(onUnmount))

    expect(onUnmount).not.toHaveBeenCalled()
    unmount()
    expect(onUnmount).toHaveBeenCalledWith(5)
    expect(onUnmount).toHaveBeenCalledTimes(1)
  })

  it('should not count time spent in background', () => {
    const onUnmount = jest.fn()
    // mount=1000, goes background=4000, comes foreground=9000, unmount=10000
    // foreground time = (4000-1000) + (10000-9000) = 4000ms = 4s
    jest
      .spyOn(Date, 'now')
      .mockReturnValueOnce(1000) // mount / foregroundStart
      .mockReturnValueOnce(4000) // background transition
      .mockReturnValueOnce(9000) // foreground transition
      .mockReturnValueOnce(10000) // unmount

    const { unmount } = renderHook(() => useTrackForegroundDuration(onUnmount))

    act(() => changeHandler!('background'))
    act(() => changeHandler!('active'))

    unmount()
    expect(onUnmount).toHaveBeenCalledWith(4)
  })

  it('should not count any time when unmounted while in background', () => {
    const onUnmount = jest.fn()
    // mount=1000 (active), goes background=4000, unmount while background
    jest
      .spyOn(Date, 'now')
      .mockReturnValueOnce(1000) // mount
      .mockReturnValueOnce(4000) // background transition

    const { unmount } = renderHook(() => useTrackForegroundDuration(onUnmount))

    act(() => changeHandler!('background'))
    unmount()
    expect(onUnmount).toHaveBeenCalledWith(3)
  })

  it('should not count time when mounted while app is in background', () => {
    AppState.currentState = 'background'
    const onUnmount = jest.fn()
    // mounted in background, comes foreground=5000, unmount=8000
    jest
      .spyOn(Date, 'now')
      .mockReturnValueOnce(5000) // foreground transition
      .mockReturnValueOnce(8000) // unmount

    const { unmount } = renderHook(() => useTrackForegroundDuration(onUnmount))

    act(() => changeHandler!('active'))
    unmount()
    expect(onUnmount).toHaveBeenCalledWith(3)
  })
})
