import 'react-native'
import React from 'react'
import FeedbackSection from '../FeedbackSection'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { IFeedbackProps } from '../../interfaces/exercise'
import { ARTICLES } from '../../constants/data'
import { CorrectFeedbackIcon, IncorrectFeedbackIcon, AlmostCorrectFeedbackIcon } from '../../../assets/images'

describe('Components', () => {
  describe('Feedback section', () => {
    const defaultFeedbackProps: IFeedbackProps = {
      input: '',
      result: '',
      secondAttempt: false,
      document: {
        alternatives: [],
        article: '',
        audio: '',
        id: 0,
        image: '',
        word: ''
      }
    }

    it('should render without issues', () => {
      const component = shallow(<FeedbackSection {...defaultFeedbackProps} />)
      expect(toJson(component)).toMatchSnapshot()
    })

    it('should not render when there is no result and secondAttempt is false', () => {
      const feedbackProps: IFeedbackProps = {
        ...defaultFeedbackProps
      }

      const component = shallow(<FeedbackSection {...feedbackProps} />)
      expect(component.isEmptyRender()).toBe(true)
    })

    it('should render success feedback when the result is correct', () => {
      const feedbackProps: IFeedbackProps = {
        ...defaultFeedbackProps,
        result: 'correct'
      }
      const message = 'Great, keep it up! \nThe Word you filled in is correct.'
      const icon = <CorrectFeedbackIcon width={28} height={28} />

      const component = shallow(<FeedbackSection {...feedbackProps} />)
      expect(component.find('Text').props().children).toBe(message)
      expect(component.contains(icon)).toBe(true)
    })

    it('should render error feedback when the result is incorrect and the second attempt is false', () => {
      const feedbackProps: IFeedbackProps = {
        ...defaultFeedbackProps,
        result: 'incorrect',
        document: {
          article: 'der',
          word: 'Winkel',
          audio: '',
          alternatives: [],
          id: 1,
          image: ''
        }
      }
      const message = `What a pity! Your entry is incorrect,\nthe correct answer is: ${
        feedbackProps.document?.article?.toLowerCase() === ARTICLES.diePlural ? 'die' : feedbackProps.document?.article
      } ${feedbackProps.document?.word}`
      const icon = <IncorrectFeedbackIcon width={28} height={28} />

      const component = shallow(<FeedbackSection {...feedbackProps} />)
      expect(component.find('Text').props().children).toBe(message)
      expect(component.contains(icon)).toBe(true)
    })

    it('should render almost correct feedback when the result is similar', () => {
      const feedbackProps: IFeedbackProps = {
        ...defaultFeedbackProps,
        result: 'similar',
        input: 'der winkel',
        secondAttempt: true
      }
      const message = `Your entry ${feedbackProps.input} is almost correct. Check for upper and lower case.`
      const icon = <AlmostCorrectFeedbackIcon width={28} height={28} />

      const component = shallow(<FeedbackSection {...feedbackProps} />)
      expect(component.find('Text').props().children).toBe(message)
      expect(component.contains(icon)).toBe(true)
    })
  })
})
