import { fireEvent, RenderAPI, waitFor } from '@testing-library/react-native'
import React from 'react'

import { ARTICLES, VOCABULARY_ITEM_TYPES, SIMPLE_RESULTS } from '../../../../constants/data'
import { VocabularyItem } from '../../../../constants/endpoints'
import { VocabularyItemResult } from '../../../../navigation/NavigationTypes'
import { getLabels } from '../../../../services/helpers'
import VocabularyItemBuilder from '../../../../testing/VocabularyItemBuilder'
import render from '../../../../testing/render'
import InteractionSection from '../InteractionSection'

jest.mock('../../../../components/FavoriteButton', () => () => {
  const { Text } = require('react-native')
  return <Text>FavoriteButton</Text>
})

jest.mock('react-native-tts', () => ({
  getInitStatus: jest.fn(async () => 'success'),
  addListener: jest.fn(async () => ({ remove: jest.fn() })),
}))

jest.mock('react-native-sound-player', () => ({
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
}))

jest.mock('react-native-popover-view', () => ({
  __esModule: true,
  default: 'Popover',
  PopoverPlacement: 'top',
}))

describe('InteractionSection', () => {
  const storeResult = jest.fn()

  const vocabularyItem = new VocabularyItemBuilder(1).build()[0]

  const dividedVocabularyItem: VocabularyItem = {
    alternatives: [],
    article: ARTICLES[1],
    audio: 'https://example.com/my-audio',
    id: 0,
    type: VOCABULARY_ITEM_TYPES.lunesStandard,
    images: [],
    word: 'kontaktlose Spannungsprüfer',
  }

  const renderInteractionSection = (
    vocabularyItemWithResult: VocabularyItemResult,
    isAnswerSubmitted: boolean
  ): RenderAPI =>
    render(
      <InteractionSection
        vocabularyItemWithResult={vocabularyItemWithResult}
        isAnswerSubmitted={isAnswerSubmitted}
        storeResult={storeResult}
      />
    )

  it('should render correctly if not submitted answer yet', () => {
    const { getByText, getByPlaceholderText } = renderInteractionSection(
      { vocabularyItem, result: null, numberOfTries: 0 },
      false
    )
    expect(getByText(getLabels().exercises.write.checkInput)).toBeDisabled()
    expect(getByPlaceholderText(getLabels().exercises.write.insertAnswer)).toBeDefined()
  })

  it('should not show check button if answer submitted', () => {
    const { queryByText } = renderInteractionSection({ vocabularyItem, result: 'correct', numberOfTries: 1 }, true)
    expect(queryByText(getLabels().exercises.write.checkInput)).toBeNull()
  })

  it('should show popup if article missing', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = renderInteractionSection(
      { vocabularyItem, result: null, numberOfTries: 0 },
      false
    )
    const inputField = getByPlaceholderText(getLabels().exercises.write.insertAnswer)
    fireEvent.changeText(inputField, 'Spachtel')
    const button = getByText(getLabels().exercises.write.checkInput)
    fireEvent.press(button)
    await waitFor(() => expect(getByTestId('popover').props.isVisible).toBeTruthy())
  })

  it('should show incorrect if word is not correct', async () => {
    const { rerender, getByText, getByPlaceholderText } = renderInteractionSection(
      { vocabularyItem, result: null, numberOfTries: 0 },
      false
    )
    const inputField = getByPlaceholderText(getLabels().exercises.write.insertAnswer)
    fireEvent.changeText(inputField, 'die WrongAnswer')
    fireEvent.press(getByText(getLabels().exercises.write.checkInput))

    const vocabularyItemWithResult = { vocabularyItem, result: SIMPLE_RESULTS.incorrect, numberOfTries: 1 }
    expect(storeResult).toHaveBeenCalledWith(vocabularyItemWithResult)

    rerender(
      <InteractionSection
        vocabularyItemWithResult={vocabularyItemWithResult}
        isAnswerSubmitted
        storeResult={storeResult}
      />
    )
    expect(getByText(getLabels().exercises.write.feedback.wrong, { exact: false })).toBeTruthy()
  })

  it('should show similar if word is similar', async () => {
    const { rerender, getByText, getByPlaceholderText } = renderInteractionSection(
      { vocabularyItem, result: null, numberOfTries: 0 },
      false
    )
    const inputField = getByPlaceholderText(getLabels().exercises.write.insertAnswer)
    fireEvent.changeText(inputField, 'die Wachtel')
    fireEvent.press(getByText(getLabels().exercises.write.checkInput))

    const vocabularyItemWithResult = { vocabularyItem, result: SIMPLE_RESULTS.similar, numberOfTries: 1 }
    expect(storeResult).toHaveBeenCalledWith(vocabularyItemWithResult)

    rerender(
      <InteractionSection
        vocabularyItemWithResult={vocabularyItemWithResult}
        isAnswerSubmitted
        storeResult={storeResult}
      />
    )
    expect(getByText(getLabels().exercises.write.feedback.almostCorrect2, { exact: false })).toBeTruthy()
  })

  it('should show similar if word is correct and article similar', async () => {
    const { rerender, getByText, getByPlaceholderText } = renderInteractionSection(
      { vocabularyItem, result: null, numberOfTries: 0 },
      false
    )
    const inputField = getByPlaceholderText(getLabels().exercises.write.insertAnswer)
    fireEvent.changeText(inputField, 'das Spachtel')
    fireEvent.press(getByText(getLabels().exercises.write.checkInput))

    const vocabularyItemWithResult = { vocabularyItem, result: SIMPLE_RESULTS.similar, numberOfTries: 1 }
    expect(storeResult).toHaveBeenCalledWith(vocabularyItemWithResult)

    rerender(
      <InteractionSection
        vocabularyItemWithResult={vocabularyItemWithResult}
        isAnswerSubmitted
        storeResult={storeResult}
      />
    )
    expect(getByText(getLabels().exercises.write.feedback.almostCorrect2, { exact: false })).toBeTruthy()
  })

  it('should show correct', async () => {
    const { rerender, getByText, getByPlaceholderText } = renderInteractionSection(
      { vocabularyItem, result: null, numberOfTries: 0 },
      false
    )
    const inputField = getByPlaceholderText(getLabels().exercises.write.insertAnswer)
    fireEvent.changeText(inputField, 'die Spachtel')
    fireEvent.press(getByText(getLabels().exercises.write.checkInput))

    const vocabularyItemWithResult = { vocabularyItem, result: SIMPLE_RESULTS.correct, numberOfTries: 1 }
    expect(storeResult).toHaveBeenCalledWith(vocabularyItemWithResult)

    rerender(
      <InteractionSection
        vocabularyItemWithResult={vocabularyItemWithResult}
        isAnswerSubmitted
        storeResult={storeResult}
      />
    )
    expect(getByText('Toll, weiter so!', { exact: false })).toBeTruthy()
  })

  it('should show correct for divided words', async () => {
    const { rerender, getByText, getByPlaceholderText } = renderInteractionSection(
      { vocabularyItem: dividedVocabularyItem, result: null, numberOfTries: 0 },
      false
    )
    const inputField = getByPlaceholderText(getLabels().exercises.write.insertAnswer)
    fireEvent.changeText(inputField, 'der kontaktlose Spannungsprüfer')
    fireEvent.press(getByText(getLabels().exercises.write.checkInput))

    const vocabularyItemWithResult = {
      vocabularyItem: dividedVocabularyItem,
      result: SIMPLE_RESULTS.correct,
      numberOfTries: 1,
    }
    expect(storeResult).toHaveBeenCalledWith(vocabularyItemWithResult)

    rerender(
      <InteractionSection
        vocabularyItemWithResult={vocabularyItemWithResult}
        isAnswerSubmitted
        storeResult={storeResult}
      />
    )
    expect(getByText('Toll, weiter so!', { exact: false })).toBeTruthy()
  })

  it('should show correct for articels starting with an uppercase letter', async () => {
    const { rerender, getByText, getByPlaceholderText } = renderInteractionSection(
      { vocabularyItem, result: null, numberOfTries: 0 },
      false
    )
    const inputField = getByPlaceholderText(getLabels().exercises.write.insertAnswer)
    fireEvent.changeText(inputField, 'Die Spachtel')
    fireEvent.press(getByText(getLabels().exercises.write.checkInput))

    const vocabularyItemWithResult = { vocabularyItem, result: SIMPLE_RESULTS.correct, numberOfTries: 1 }
    expect(storeResult).toHaveBeenCalledWith(vocabularyItemWithResult)

    rerender(
      <InteractionSection
        vocabularyItemWithResult={vocabularyItemWithResult}
        isAnswerSubmitted
        storeResult={storeResult}
      />
    )
    expect(getByText('Toll, weiter so!', { exact: false })).toBeTruthy()
  })
})
