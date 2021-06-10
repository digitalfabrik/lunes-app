import React from 'react'
import { SingleChoice } from '../components/SingleChoice'
import { SingleChoiceListItemPropsType } from '../components/SingleChoiceListItem'

const SingleChoiceExerciseScreen = () => {
  // This is mock data and should be deleted later on
  const answerOptions: SingleChoiceListItemPropsType[] = [
    {
      article: 'das',
      word: 'Schraube',
      correct: false,
      selected: false,
      pressed: false,
      addOpacity: true
    },
    {
      article: 'die',
      word: 'Zange',
      correct: true,
      selected: true,
      pressed: false,
      addOpacity: false
    },
    {
      article: 'der',
      word: 'Stapler',
      pressed: false,
      correct: false,
      selected: true,
      addOpacity: true
    },
    {
      article: 'die (plural)',
      word: 'Häuser',
      correct: false,
      pressed: true,
      selected: false,
      addOpacity: false
    }
  ]

  return <SingleChoice answerOptions={answerOptions} />
}

export default SingleChoiceExerciseScreen
