import React from 'react'
import AnswerSection, { AnswerSectionPropsType } from '../AnswerSection'
import { fireEvent, render } from '@testing-library/react-native'
import labels from '../../../../constants/labels.json'

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

  /*  it('renders correctly across screens', () => {
        const component = shallow(<AnswerSection {...defaultAnswerSectionProps} />)
        expect(toJson(component)).toMatchSnapshot()
      })

      it('should render text input', () => {
        const component = shallow(<AnswerSection {...defaultAnswerSectionProps} />)
        expect(component.find('[testID="input-field"]')).toHaveLength(1)
      })*/

  it('should show correct for word', async () => {
    const { findByPlaceholderText, findByRole, findByText } = render(<AnswerSection {...defaultAnswerSectionProps} />)
    const input = await findByPlaceholderText(labels.exercises.write.insertAnswer)
    // await fireEvent.changeText(input, {target: {value: 'Die Spachtel'}})
    const button = await findByRole('button')
    await fireEvent.press(button)
    const result = findByText(labels.results.correct)
    expect(result).toBeTruthy()
  })
})
