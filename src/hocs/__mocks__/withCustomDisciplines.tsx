import React from 'react'

const withCustomDisciplines = <Props extends { customDisciplines: string[] }>(
  Component: React.ComponentType<Props>
): React.ComponentType<Omit<Props, 'customDisciplines'>> => {
  return (props: Omit<Props, 'customDisciplines'>) => {
    const customDisciplines = ['test']

    return <Component {...(props as Props)} customDisciplines={customDisciplines} />
  }
}

export default withCustomDisciplines
