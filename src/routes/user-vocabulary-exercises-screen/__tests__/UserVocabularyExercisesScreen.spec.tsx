import { CommonActions, RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { fireEvent, RenderAPI } from '@testing-library/react-native'
import React from 'react'

import { RoutesParams } from '../../../navigation/NavigationTypes'
import { getLabels } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { mockDisciplines } from '../../../testing/mockDiscipline'
import render from '../../../testing/render'
import UserVocabularyExercisesScreen from '../UserVocabularyExercisesScreen'

describe('UserVocabularyExerciseScreen', () => {
  let navigation: StackNavigationProp<RoutesParams, 'UserVocabularyExercises'>
  const vocabularyItems = new VocabularyItemBuilder(2).build()
  const discipline = mockDisciplines(true)[0]
  const renderScreen = (): RenderAPI => {
    const route: RouteProp<RoutesParams, 'UserVocabularyExercises'> = {
      key: '',
      name: 'UserVocabularyExercises',
      params: {
        discipline,
        disciplineId: 0,
        disciplineTitle: `${getLabels().userVocabulary.practice.part} 1`,
        vocabularyItems,
      },
    }
    navigation = createNavigationMock<'UserVocabularyExercises'>()
    return render(<UserVocabularyExercisesScreen route={route} navigation={navigation} />)
  }

  it('should render correctly', () => {
    const { getByText } = renderScreen()
    expect(getByText(`${getLabels().userVocabulary.practice.part} 1`)).toBeDefined()
    expect(getByText(`2 ${getLabels().general.words}`)).toBeDefined()
    expect(getByText(getLabels().exercises.vocabularyList.title)).toBeDefined()
    expect(getByText(getLabels().exercises.wordChoice.title)).toBeDefined()
    expect(getByText(getLabels().exercises.articleChoice.title)).toBeDefined()
    expect(getByText(getLabels().exercises.write.title)).toBeDefined()
    expect(getByText(getLabels().exercises.write.description)).toBeDefined()
  })

  it('should render correctly on click', () => {
    const { getByText } = renderScreen()
    const wordChoiceExercise = getByText(getLabels().exercises.wordChoice.title)
    fireEvent.press(wordChoiceExercise)
    expect(navigation.navigate).toHaveBeenCalledWith('WordChoiceExercise', {
      closeExerciseAction: CommonActions.navigate('UserVocabularyExercises', {
        vocabularyItems,
        disciplineTitle: `${getLabels().userVocabulary.practice.part} 1`,
        disciplineId: 0,
      }),
      vocabularyItems,
      disciplineTitle: `${getLabels().userVocabulary.practice.part} 1`,
      disciplineId: 0,
    })
  })
})
