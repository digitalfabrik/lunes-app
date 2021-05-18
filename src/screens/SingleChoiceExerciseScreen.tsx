import React from 'react'
import { SingleChoice } from '../components/SingleChoice'
import { ISingleChoiceListItemProps } from '../components/SingleChoiceListItem'

const SingleChoiceExerciseScreen = () => {
  const answerOptions: ISingleChoiceListItemProps[] = [
    {
      article: 'das',
      word: 'Schraube',
      correct: false,
      selected: false,
      addOpacity: true
    },
    {
      article: 'die',
      word: 'Zange',
      correct: true,
      selected: true,
      addOpacity: false
    },
    {
      article: 'der',
      word: 'Stapler',
      correct: false,
      selected: true,
      addOpacity: true
    },
    {
      article: 'die (plural)',
      word: 'Häuser',
      correct: false,
      selected: false,
      addOpacity: false
    }
  ]

  return <SingleChoice answerOptions={answerOptions} />
}

export default SingleChoiceExerciseScreen
