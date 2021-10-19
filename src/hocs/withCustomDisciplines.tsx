import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'

import AsyncStorage from '../services/AsyncStorage'

const withCustomDisciplines = <Props extends { customDisciplines: string[] }>(
  Component: React.ComponentType<Props>
): React.ComponentType<Omit<Props, 'customDisciplines'>> => {
  return (props: Omit<Props, 'customDisciplines'>) => {
    const [customDisciplines, setCustomDisciplines] = useState<string[]>([])
    const isFocused = useIsFocused()

    useEffect(() => {
      AsyncStorage.getCustomDisciplines()
        .then((res: string[]) => setCustomDisciplines(res ?? []))
        .catch((err: Error) => console.log('Error while fetching custom disciplines ', err))
    }, [isFocused])

    return <Component {...(props as Props)} customDisciplines={customDisciplines} />
  }
}

export default withCustomDisciplines
