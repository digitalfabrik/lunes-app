import { RenderAPI } from '@testing-library/react-native'
import React from 'react'
import 'react-native'

import { SimpleResult } from '../../../../constants/data'
import { VocabularyItemResult } from '../../../../navigation/NavigationTypes'
import { getLabels } from '../../../../services/helpers'
import VocabularyItemBuilder from '../../../../testing/VocabularyItemBuilder'
import render from '../../../../testing/render'
import AnswerReview from '../AnswerReview'

describe('AnswerReview', () => {
  const vocabularyItem = new VocabularyItemBuilder(1).build()[0]

  const renderAnswerReview = (result: SimpleResult, numberOfTries: number, submission: string): RenderAPI => {
    const vocabularyItemResult: VocabularyItemResult = { vocabularyItem, result, numberOfTries }
    return render(<AnswerReview vocabularyItemWithResult={vocabularyItemResult} submission={submission} />)
  }

  it('should render correct answer review', () => {
    const submission = 'Die Abrissbirne'
    const { queryByText } = renderAnswerReview('correct', 1, submission)
    expect(queryByText(getLabels().exercises.write.feedback.correct.replace('\n', ''))).toBeTruthy()
  })

  it('should render similar answer review', () => {
    const submission = 'Die Abrissbirn'
    const { queryByText } = renderAnswerReview('similar', 1, submission)
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
    const { queryByText } = renderAnswerReview('incorrect', 1, submission)
    expect(
      queryByText(
        `${getLabels().exercises.write.feedback.wrong} ${getLabels().exercises.write.feedback.solution} „${
          vocabularyItem.article.value
        } ${vocabularyItem.word}“`
      )
    ).toBeTruthy()
  })
  it('should render incorrect answer review with retries not exceeded', () => {
    const submission = 'Der Auto'
    const { queryByText } = renderAnswerReview('incorrect', 1, submission)
    expect(
      queryByText(
        `${getLabels().exercises.write.feedback.wrong} ${getLabels().exercises.write.feedback.solution} „${
          vocabularyItem.article.value
        } ${vocabularyItem.word}“`
      )
    ).toBeTruthy()
  })
})
