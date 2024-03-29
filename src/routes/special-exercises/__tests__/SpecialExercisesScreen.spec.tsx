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
import SpecialExercisesScreen from '../SpecialExercisesScreen'

describe('SpecialExercisesScreen', () => {
  let navigation: StackNavigationProp<RoutesParams, 'SpecialExercises'>
  const vocabularyItems = new VocabularyItemBuilder(2).build()
  const discipline = mockDisciplines(true)[0]
  const renderScreen = (): RenderAPI => {
    const route: RouteProp<RoutesParams, 'SpecialExercises'> = {
      key: '',
      name: 'SpecialExercises',
      params: {
        discipline,
        contentType: 'userVocabulary',
        disciplineTitle: `${getLabels().userVocabulary.practice.part} 1`,
        vocabularyItems,
      },
    }
    navigation = createNavigationMock<'SpecialExercises'>()
    return render(<SpecialExercisesScreen route={route} navigation={navigation} />)
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
      closeExerciseAction: CommonActions.navigate('SpecialExercises', {
        vocabularyItems,
        disciplineTitle: `${getLabels().userVocabulary.practice.part} 1`,
      }),
      contentType: 'userVocabulary',
      vocabularyItems,
      disciplineTitle: `${getLabels().userVocabulary.practice.part} 1`,
    })
  })
})
