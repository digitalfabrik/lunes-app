import React from 'react'
import AnswerSection, { AnswerSectionPropsType } from '../AnswerSection'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe('AnswerSection', () => {
  const defaultAnswerSectionProps: AnswerSectionPropsType = {
    documents: [],
    trainingSet: '',
    disciplineTitle: '',
    currentDocumentNumber: 0,
    tryLater: () => {},
    finishExercise: () => {},
    setCurrentDocumentNumber: () => {}
  }

  it('renders correctly across screens', () => {
    const component = shallow(<AnswerSection {...defaultAnswerSectionProps} />)
    expect(toJson(component)).toMatchSnapshot()
  })

  it('should render text input', () => {
    const component = shallow(<AnswerSection {...defaultAnswerSectionProps} />)
    expect(component.find('[testID="input-field"]')).toHaveLength(1)
  })
})
