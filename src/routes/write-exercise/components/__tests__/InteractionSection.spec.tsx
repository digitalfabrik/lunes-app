import { fireEvent, render, RenderAPI, waitFor } from '@testing-library/react-native'
import React from 'react'

import { ARTICLES } from '../../../../constants/data'
import labels from '../../../../constants/labels.json'
import { DocumentResultType } from '../../../../navigation/NavigationTypes'
import wrapWithTheme from '../../../../testing/wrapWithTheme'
import InteractionSection from '../InteractionSection'

describe('InteractionSection', () => {
  const storeResult = jest.fn()

  const document = {
    alternatives: [
      {
        word: 'Spachtel',
        article: ARTICLES[2]
      },
      {
        word: 'Alternative',
        article: ARTICLES[2]
      }
    ],
    article: ARTICLES[1],
    audio: 'https://example.com/my-audio',
    id: 0,
    document_image: [],
    word: 'Spachtel'
  }

  const renderInteractionSection = (documentWithResult: DocumentResultType, isAnswerSubmitted: boolean): RenderAPI => {
    return render(
      <InteractionSection
        documentWithResult={documentWithResult}
        isAnswerSubmitted={isAnswerSubmitted}
        storeResult={storeResult}
      />,
      { wrapper: wrapWithTheme }
    )
  }

  it('should render correctly if not submitted answer yet', () => {
    const { getByText, getByPlaceholderText } = renderInteractionSection(
      { ...document, result: null, numberOfTries: 0 },
      false
    )
    expect(getByText(labels.exercises.write.checkInput)).toBeDisabled()
    expect(getByPlaceholderText(labels.exercises.write.insertAnswer)).toBeDefined()
  })

  it('should not show check button if answer submitted', () => {
    const { queryByText } = renderInteractionSection({ ...document, result: 'correct', numberOfTries: 1 }, true)
    expect(queryByText(labels.exercises.write.checkInput)).toBeNull()
  })

  // will be fixed in LUN-230
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should show popup if article missing', async () => {
    const { getByText, getByPlaceholderText } = renderInteractionSection(
      { ...document, result: null, numberOfTries: 0 },
      false
    )
    const inputField = getByPlaceholderText(labels.exercises.write.insertAnswer)
    fireEvent.changeText(inputField, 'Spachtel')
    const button = getByText(labels.exercises.write.checkInput)
    fireEvent.press(button)
    await waitFor(() => expect(getByText(labels.exercises.write.feedback.articleMissing)).toBeDefined())
  })
})
