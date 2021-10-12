import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'

import AsyncStorage from '../services/AsyncStorage'

const withCustomDiscipline = <Props extends { customDisciplines: string[] }>(
  Component: React.ComponentType<Props>
): React.ComponentType<Omit<Props, 'customDisciplines'>> => {
  return (props: any) => {
    const [customDisciplines, setCustomDisciplines] = useState<string[]>([])
    const isFocused = useIsFocused()

    useEffect(() => {
      AsyncStorage.getCustomDisciplines()
        .then((res: string[]) => (res === null ? setCustomDisciplines([]) : setCustomDisciplines(res)))
        .catch((err: Error) => console.log('Error while fetching custom disciplines ', err))
    }, [isFocused])

    return <Component customDisciplines={customDisciplines} {...props} />
  }
}

export default withCustomDiscipline
