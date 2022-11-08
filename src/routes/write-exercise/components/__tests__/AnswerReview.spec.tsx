import { RenderAPI } from '@testing-library/react-native'
import React from 'react'
import 'react-native'

import { SimpleResult } from '../../../../constants/data'
import { VocabularyItemResult } from '../../../../navigation/NavigationTypes'
import { getLabels } from '../../../../services/helpers'
import VocabularyItemBuilder from '../../../../testing/VocabularyItemBuilder'
import render from '../../../../testing/render'
import AnswerReview from '../AnswerReview'

describe('Feedback', () => {
  const vocabularyItem = new VocabularyItemBuilder(1).build()[0]

  const renderAnswerReview = (
    result: SimpleResult,
    numberOfTries: number,
    submission: string,
    needsToBeRepeated: boolean
  ): RenderAPI => {
    const vocabularyItemWithResult: VocabularyItemResult = { vocabularyItem, result, numberOfTries }
    return render(
      <AnswerReview
        documentWithResult={vocabularyItemWithResult}
        submission={submission}
        needsToBeRepeated={needsToBeRepeated}
      />
    )
  }

  it('should render correct answer review', () => {
    const submission = 'Die Abrissbirne'
    const { queryByText } = renderAnswerReview('correct', 1, submission, false)
    expect(queryByText(getLabels().exercises.write.feedback.correct.replace('\n', ''))).toBeTruthy()
  })

  it('should render similar answer review', () => {
    const submission = 'Die Abrissbirn'
    const { queryByText } = renderAnswerReview('similar', 1, submission, true)

    expect(
      queryByText(
        `${getLabels().exercises.write.feedback.almostCorrect1} „${submission}“ ${
          getLabels().exercises.write.feedback.almostCorrect2
        }`
      )
    ).toBeTruthy()
  })

  it('should render finally incorrect answer review', () => {
    const submission = 'Der Auto'
    const { queryByText } = renderAnswerReview('incorrect', 1, submission, false)

    expect(
      queryByText(
        `${getLabels().exercises.write.feedback.wrongWithSolution} „${vocabularyItem.article.value} ${
          vocabularyItem.word
        }“`
      )
    ).toBeTruthy()
  })

  it('should render incorrect answer review with retries not exceeded', () => {
    const submission = 'Der Auto'
    const { queryByText } = renderAnswerReview('incorrect', 1, submission, true)

    expect(
      queryByText(
        `${getLabels().exercises.write.feedback.wrong} ${getLabels().exercises.write.feedback.wrongWithSolution} „${
          vocabularyItem.article.value
        } ${vocabularyItem.word}“`
      )
    ).toBeTruthy()
  })
})
