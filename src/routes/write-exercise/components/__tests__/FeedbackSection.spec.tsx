/* eslint-disable @typescript-eslint/no-non-null-assertion */
import 'react-native'
import React from 'react'
import FeedbackSection, { FeedbackPropsType } from '../FeedbackSection'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { ARTICLES } from '../../../../constants/data'
import { AlmostCorrectFeedbackIcon, CorrectFeedbackIcon, IncorrectFeedbackIcon } from '../../../../../assets/images'
import labels from '../../../../constants/labels.json'

describe('Feedback section', () => {
  const defaultFeedbackProps: FeedbackPropsType = {
    input: '',
    result: '',
    secondAttempt: false,
    document: {
      alternatives: [],
      article: ARTICLES[0],
      audio: '',
      id: 0,
      document_image: [],
      word: ''
    }
  }

  it('should render without issues', () => {
    const component = shallow(<FeedbackSection {...defaultFeedbackProps} />)
    expect(toJson(component)).toMatchSnapshot()
  })

  it('should not render when there is no result and secondAttempt is false', () => {
    const feedbackProps: FeedbackPropsType = {
      ...defaultFeedbackProps
    }

    const component = shallow(<FeedbackSection {...feedbackProps} />)
    expect(component.isEmptyRender()).toBe(true)
  })

  it('should render success feedback when the result is correct', () => {
    const feedbackProps: FeedbackPropsType = {
      ...defaultFeedbackProps,
      result: 'correct'
    }
    const message = labels.exercises.write.feedback.correct
    const icon = <CorrectFeedbackIcon width={28} height={28} />

    const component = shallow(<FeedbackSection {...feedbackProps} />)
    expect(component.props().children[1].props.children).toBe(message)
    expect(component.contains(icon)).toBe(true)
  })

  it('should render error feedback when the result is incorrect and the second attempt is false', () => {
    const feedbackProps: FeedbackPropsType = {
      ...defaultFeedbackProps,
      result: 'incorrect',
      document: {
        article: ARTICLES[1],
        word: 'Winkel',
        audio: '',
        alternatives: [],
        id: 1,
        document_image: []
      }
    }
    const message = `${labels.exercises.write.feedback.wrong} „${feedbackProps.document!.article.value} ${
      feedbackProps.document!.word
    }“`
    const icon = <IncorrectFeedbackIcon width={28} height={28} />

    const component = shallow(<FeedbackSection {...feedbackProps} />)
    expect(component.props().children[1].props.children).toBe(message)
    expect(component.contains(icon)).toBe(true)
  })

  it('should render almost correct feedback when the result is similar', () => {
    const feedbackProps: FeedbackPropsType = {
      ...defaultFeedbackProps,
      result: 'similar',
      input: 'der winkel',
      secondAttempt: true
    }
    const message = `${labels.exercises.write.feedback.almostCorrect1} „${feedbackProps.input}“ ${labels.exercises.write.feedback.almostCorrect2}`
    const icon = <AlmostCorrectFeedbackIcon width={28} height={28} />

    const component = shallow(<FeedbackSection {...feedbackProps} />)
    expect(component.props().children[1].props.children).toBe(message)
    expect(component.contains(icon)).toBe(true)
  })
})
