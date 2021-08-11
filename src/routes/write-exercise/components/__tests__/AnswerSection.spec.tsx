import React from 'react'
import AnswerSection, { AnswerSectionPropsType } from '../AnswerSection'
import { fireEvent, render } from '@testing-library/react-native'
import labels from '../../../../constants/labels.json'

jest.mock('../../../../components/AudioPlayer', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})

jest.mock('react-native/Libraries/LogBox/Data/LogBoxData')

describe('AnswerSection', () => {
  const defaultAnswerSectionProps: AnswerSectionPropsType = {
    documents: [
      {
        id: 1,
        word: 'Spachtel',
        article: {
          id: 1,
          value: 'Der'
        },
        document_image: [{ id: 1, image: '' }],
        audio: '',
        alternatives: [
          {
            word: 'Spachtel',
            article: {
              id: 2,
              value: 'Die'
            }
          },
          {
            word: 'Alternative',
            article: {
              id: 2,
              value: 'Die'
            }
          }
        ]
      }
    ],
    trainingSet: '',
    disciplineTitle: '',
    currentDocumentNumber: 0,
    tryLater: () => {},
    finishExercise: () => {},
    setCurrentDocumentNumber: () => {}
  }

  const evaluate = async (input: string, expectedFeedback: string) => {
    const { getByPlaceholderText, getByText, getByTestId } = render(<AnswerSection {...defaultAnswerSectionProps} />)
    const inputField = await getByPlaceholderText(labels.exercises.write.insertAnswer)
    await fireEvent.changeText(inputField, input)
    const button = await getByText(labels.exercises.write.checkInput)
    await fireEvent.press(button)
    const result = await getByTestId('feedback-write-exercise')
    expect(result.children[0]).toEqual(expectedFeedback)
  }

  it('should show correct-feedback for correct solution', async () => {
    await evaluate('Der Spachtel', labels.exercises.write.feedback.correct)
  })

  it('should show correct-feedback for alternative article', async () => {
    await evaluate('Die Spachtel', labels.exercises.write.feedback.correct)
  })

  it('should show correct-feedback for alternative solution', async () => {
    await evaluate('Die Alternative', labels.exercises.write.feedback.correct)
  })

  it('should show almost correct feedback', async () => {
    const input = 'Die Spachtl'
    await evaluate(
      input,
      `${labels.exercises.write.feedback.almostCorrect1} „${input}“ ${labels.exercises.write.feedback.almostCorrect2}`
    )
  })

  it('should show wrong feedback', async () => {
    evaluate(
      'Das Falsche',
      `${labels.exercises.write.feedback.wrong} ${defaultAnswerSectionProps.documents[0].article.value} ${defaultAnswerSectionProps.documents[0].word}`
    )
  })
})
