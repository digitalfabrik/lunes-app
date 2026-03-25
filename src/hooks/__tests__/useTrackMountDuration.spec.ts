import { renderHook } from '@testing-library/react-native'

import useTrackMountDuration from '../useTrackMountDuration'

describe('useTrackMountDuration', () => {
  it('should call onUnmount with duration in seconds', () => {
    const onUnmount = jest.fn()
    jest.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(6000)

    const { unmount } = renderHook(() => useTrackMountDuration(onUnmount))

    expect(onUnmount).not.toHaveBeenCalled()
    unmount()
    expect(onUnmount).toHaveBeenCalledWith(5)
    expect(onUnmount).toHaveBeenCalledTimes(1)
  })
})
