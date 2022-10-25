import { RenderAPI } from '@testing-library/react-native'
import React from 'react'
import 'react-native'

import { SimpleResult } from '../../../../constants/data'
import { VocabularyItemResult } from '../../../../navigation/NavigationTypes'
import { getLabels } from '../../../../services/helpers'
import render from '../../../../testing/render'
import Feedback from '../Feedback'
import VocabularyItemBuilder from "../../../../testing/VocabularyItemBuilder";

describe('Feedback', () => {
  const vocabularyItem = new VocabularyItemBuilder(1).build()[0]

  const renderFeedback = (
    result: SimpleResult,
    numberOfTries: number,
    submission: string,
    needsToBeRepeated: boolean
  ): RenderAPI => {
    const vocabularyItemWithResult: VocabularyItemResult = { vocabularyItem, result, numberOfTries }
    return render(
      <Feedback
        vocabularyItemWithResult={vocabularyItemWithResult}
        submission={submission}
        needsToBeRepeated={needsToBeRepeated}
      />
    )
  }

  it('should render correct feedback', () => {
    const submission = 'Die Abrissbirne'
    const { queryByText } = renderFeedback('correct', 1, submission, false)
    expect(queryByText(getLabels().exercises.write.feedback.correct.replace('\n', ''))).toBeTruthy()
  })

  it('should render similar feedback', () => {
    const submission = 'Die Abrissbirn'
    const { queryByText } = renderFeedback('similar', 1, submission, true)

    expect(
      queryByText(
        `${getLabels().exercises.write.feedback.almostCorrect1} „${submission}“ ${
          getLabels().exercises.write.feedback.almostCorrect2
        }`
      )
    ).toBeTruthy()
  })

  it('should render finally incorrect feedback', () => {
    const submission = 'Der Auto'
    const { queryByText } = renderFeedback('incorrect', 1, submission, false)

    expect(
      queryByText(
        `${getLabels().exercises.write.feedback.wrongWithSolution} „${vocabularyItem.article.value} ${
          vocabularyItem.word
        }“`
      )
    ).toBeTruthy()
  })

  it('should render incorrect feedback with retries not exceeded', () => {
    const submission = 'Der Auto'
    const { queryByText } = renderFeedback('incorrect', 1, submission, true)

    expect(
      queryByText(
        `${getLabels().exercises.write.feedback.wrong} ${getLabels().exercises.write.feedback.wrongWithSolution} „${
          vocabularyItem.article.value
        } ${vocabularyItem.word}“`
      )
    ).toBeTruthy()
  })
})
