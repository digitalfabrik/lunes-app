import { useEffect, useRef, useState } from 'react'

const MILLISECONDS_PER_SECOND = 1000

const useTrackMountDuration = (onUnmount: (durationSeconds: number) => void): void => {
  const [mountDate] = useState(Date.now)
  const onUnmountRef = useRef(onUnmount)
  onUnmountRef.current = onUnmount
  useEffect(
    () => () => {
      const durationSeconds = Math.round((Date.now() - mountDate) / MILLISECONDS_PER_SECOND)
      onUnmountRef.current(durationSeconds)
    },
    [mountDate],
  )
}

export default useTrackMountDuration
