import { render } from '@testing-library/react-native'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import React from 'react'
import 'react-native'

import labels from '../../../../constants/labels.json'
import wrapWithTheme from '../../../../testing/wrapWithTheme'
import Action, { IActionsProps } from '../Actions'

describe('Components', () => {
  describe('Actions', () => {
    const defaultActionProps: IActionsProps = {
      input: '',
      result: null,
      isFinished: false,
      giveUp: () => {},
      tryLater: () => {},
      checkEntry: () => {},
      continueExercise: () => {},
      needsToBeRepeated: false
    }

    it('renders correctly across screens', () => {
      const component = shallow(<Action {...defaultActionProps} />)
      expect(toJson(component)).toMatchSnapshot()
    })

    it('should render "check out" button when there is a result and isFinished is true', () => {
      const actionProps: IActionsProps = {
        ...defaultActionProps,
        result: 'correct',
        isFinished: true
      }

      const { getByText } = render(<Action {...actionProps} />, { wrapper: wrapWithTheme })
      expect(getByText(labels.exercises.showResults)).toBeDefined()
    })

    it('should render "next word" button when there is a result and isFinished is false', () => {
      const actionProps: IActionsProps = {
        ...defaultActionProps,
        result: 'correct',
        isFinished: false
      }

      const { getByText } = render(<Action {...actionProps} />, { wrapper: wrapWithTheme })
      expect(getByText(labels.exercises.next)).toBeDefined()
    })

    it('should render "check entry", "i give up", "try later" buttons when there is no result and isFinished is false', () => {
      const actionProps: IActionsProps = {
        ...defaultActionProps,
        isFinished: false
      }

      const { getByText } = render(<Action {...actionProps} />, { wrapper: wrapWithTheme })
      expect(getByText(labels.exercises.write.checkInput)).toBeDefined()
      expect(getByText(labels.exercises.tryLater)).toBeDefined()
      expect(getByText(labels.exercises.write.showSolution)).toBeDefined()
    })

    it('should render "check entry", "i give up" buttons when there is no result and isFinished is true', () => {
      const actionProps: IActionsProps = {
        ...defaultActionProps,
        isFinished: true
      }

      const { getByText } = render(<Action {...actionProps} />, { wrapper: wrapWithTheme })
      expect(getByText(labels.exercises.write.checkInput)).toBeDefined()
      expect(getByText(labels.exercises.write.showSolution)).toBeDefined()
    })

    it('should render disabled "check entry" button when input is empty', () => {
      const actionProps: IActionsProps = {
        ...defaultActionProps
      }

      const { getByText } = render(<Action {...actionProps} />, { wrapper: wrapWithTheme })
      expect(getByText(labels.exercises.write.checkInput)).toBeDisabled()
    })
  })
})
