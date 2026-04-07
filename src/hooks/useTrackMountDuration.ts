import { useEffect, useState } from 'react'

const MILLISECONDS_PER_SECOND = 1000

const useTrackMountDuration = (onUnmount: (durationSeconds: number) => void): void => {
  const [mountDate] = useState(Date.now)
  useEffect(
    () => () => onUnmount(Math.round((Date.now() - mountDate) / MILLISECONDS_PER_SECOND)),
    [mountDate, onUnmount],
  )
}

export default useTrackMountDuration
