import 'react-native'
import React from 'react'
import Action, { styles, IActionsProps } from '../Actions'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe('Components', () => {
  describe('Actions', () => {
    const defaultActionProps: IActionsProps = {
      input: '',
      result: '',
      isFinished: false,
      secondAttempt: false,
      giveUp: () => {},
      tryLater: () => {},
      checkEntry: () => {},
      getNextWord: () => {}
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

      const component = shallow(<Action {...actionProps} />)
      expect(component.find('Button')).toHaveLength(1)
      expect(component.find('[testID="check-out"]')).toHaveLength(1)
    })

    it('should render "next word" button when there is a result and isFinished is false', () => {
      const actionProps: IActionsProps = {
        ...defaultActionProps,
        result: 'correct',
        isFinished: false
      }

      const component = shallow(<Action {...actionProps} />)
      expect(component.find('Button')).toHaveLength(1)
      expect(component.find('[testID="next-word"]')).toHaveLength(1)
    })

    it('should render "check entry", "i give up", "try later" buttons when there is no result and isFinished is false', () => {
      const actionProps: IActionsProps = {
        ...defaultActionProps,
        isFinished: false
      }

      const component = shallow(<Action {...actionProps} />)
      expect(component.find('Button')).toHaveLength(3)
      expect(component.find('[testID="check-entry"]')).toHaveLength(1)
      expect(component.find('[testID="give-up"]')).toHaveLength(1)
      expect(component.find('[testID="try-later"]')).toHaveLength(1)
    })

    it('should render "check entry", "i give up" buttons when there is no result and isFinished is true', () => {
      const actionProps: IActionsProps = {
        ...defaultActionProps,
        isFinished: true
      }

      const component = shallow(<Action {...actionProps} />)
      expect(component.find('Button')).toHaveLength(2)
      expect(component.find('[testID="check-entry"]')).toHaveLength(1)
      expect(component.find('[testID="give-up"]')).toHaveLength(1)
    })

    it('should render disabled "check entry" button when input is empty', () => {
      const actionProps: IActionsProps = {
        ...defaultActionProps
      }
      const isButtonDisabled = true
      const style = [styles.lightLabel, styles.disabledButtonLabel]

      const component = shallow(<Action {...actionProps} />)
      expect(component.find('[testID="check-entry"]').props().disabled).toBe(isButtonDisabled)
      expect(component.find('[testID="check-entry"]').children().props().style).toStrictEqual(style)
    })
  })
})
