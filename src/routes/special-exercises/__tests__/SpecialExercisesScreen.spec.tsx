import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { fireEvent, RenderAPI } from '@testing-library/react-native'
import React from 'react'

import { RoutesParams } from '../../../navigation/NavigationTypes'
import { getLabels } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import mockUnits from '../../../testing/mockUnit'
import render from '../../../testing/render'
import SpecialExercisesScreen from '../SpecialExercisesScreen'

describe('SpecialExercisesScreen', () => {
  let navigation: StackNavigationProp<RoutesParams, 'SpecialExercises'>
  const vocabularyItems = new VocabularyItemBuilder(2).build()
  const unit = mockUnits[0]
  const renderScreen = (): RenderAPI => {
    const route: RouteProp<RoutesParams, 'SpecialExercises'> = {
      key: '',
      name: 'SpecialExercises',
      params: {
        unit,
        contentType: 'userVocabulary',
        jobTitle: `${getLabels().userVocabulary.practice.part} 1`,
        parentLabel: `${getLabels().userVocabulary.practice.part} 1`,
        vocabularyItems,
      },
    }
    navigation = createNavigationMock<'SpecialExercises'>()
    return render(<SpecialExercisesScreen route={route} navigation={navigation} />)
  }

  it('should render correctly', () => {
    const { getByText } = renderScreen()
    expect(getByText(`${getLabels().userVocabulary.practice.part} 1`)).toBeDefined()
    expect(getByText(`2 ${getLabels().general.word.plural}`)).toBeDefined()
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
    expect(navigation.navigate).toHaveBeenCalledWith('WordChoiceExercise', expect.anything())
  })
})
