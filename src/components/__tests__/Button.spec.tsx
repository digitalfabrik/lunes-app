import React, { ComponentProps } from 'react'
import Button, { IButtonProps } from '../Button'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { BUTTONS_THEME } from '../../constants/data'
import theme from '../../constants/theme'
import { Text } from 'react-native'

type ButtonPropsType = ComponentProps<typeof Button>

describe('Components', () => {
  describe('Button', () => {
    const defaultButtonProps: ButtonPropsType = {
      children: <Text>Button Children</Text>,
      onPress: () => {},
      disabled: false,
      buttonTheme: BUTTONS_THEME.light,
      theme: theme
    }

    it('should render without issues', () => {
      const component = shallow(<Button {...defaultButtonProps} />)
      expect(toJson(component)).toMatchSnapshot()
    })

    it('should call onPress event', () => {
      const buttonProps: ButtonPropsType = {
        ...defaultButtonProps,
        onPress: jest.fn(() => result)
      }
      const result = 'I was Pressed'

      const component = shallow(<Button {...buttonProps} />)
      expect(buttonProps.onPress).not.toHaveBeenCalled()
      component.props().onPress()
      expect((buttonProps.onPress as jest.Mock).mock.calls).toHaveLength(1)
      expect(component.props().onPress()).toBe(result)
    })

    it('should have disabled style when disabled is true', () => {
      const buttonProps: ButtonPropsType = {
        ...defaultButtonProps,
        disabled: true
      }
      const style = [false]

      const component = shallow(<Button {...buttonProps} />)
      expect(component.props().style).toStrictEqual(style)
    })

    it('should not have disabled style when disabled is false', () => {
      const buttonProps: ButtonPropsType = {
        ...defaultButtonProps
      }
      const style = [false]

      const component = shallow(<Button {...buttonProps} />)
      expect(component.props().style).toStrictEqual(style)
    })

    it('should have dark style when theme is dark', () => {
      const buttonProps: ButtonPropsType = {
        ...defaultButtonProps,
        buttonTheme: BUTTONS_THEME.dark
      }
      const style = [false]

      const component = shallow(<Button {...buttonProps} />)
      expect(component.props().style).toStrictEqual(style)
    })

    it('should have light style when theme is light', () => {
      const buttonProps: IButtonProps = {
        ...defaultButtonProps,
        buttonTheme: BUTTONS_THEME.light
      }
      const style = [false]

      const component = shallow(<Button {...buttonProps} />)
      expect(component.props().style).toStrictEqual(style)
    })

    it('should render children passed to it', () => {
      const buttonProps: IButtonProps = {
        ...defaultButtonProps
      }

      const component = shallow(<Button {...buttonProps} />)
      expect(component.contains(buttonProps.children)).toBe(true)
    })
  })
})
