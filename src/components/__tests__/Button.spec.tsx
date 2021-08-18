import React, { ComponentProps } from 'react'
import { Text } from 'react-native'
import Button from '../Button'
import { shallow, ShallowWrapper } from 'enzyme'
import { BUTTONS_THEME } from '../../constants/data'
import { COLORS } from '../../constants/theme/colors'
import { mocked } from 'ts-jest/utils'
import wrapWithTheme from '../../testing/wrapWithTheme'

type ButtonPropsType = ComponentProps<typeof Button>

const expectStylesToMatch = (component: ShallowWrapper<ButtonPropsType>, expectedStyles: Record<string, any>): void => {
  expect(component.dive().dive().dive().prop<Record<string, any>>('style')[0]).toEqual(
    expect.objectContaining(expectedStyles)
  )
}

const expectStylesNotToMatch = (
  component: ShallowWrapper<ButtonPropsType>,
  expectedStyles: Record<string, any>
): void => {
  expect(component.dive().dive().dive().prop<Record<string, any>>('style')[0]).not.toEqual(
    expect.objectContaining(expectedStyles)
  )
}

describe('Components', () => {
  describe('Button', () => {
    const defaultButtonProps: ButtonPropsType = {
      children: <Text>Button Children</Text>,
      onPress: () => {},
      disabled: false,
      buttonTheme: BUTTONS_THEME.light
    }

    const renderButton = (overrideProps: Partial<ButtonPropsType> = {}): ShallowWrapper<ButtonPropsType> => {
      const buttonProps = {
        ...defaultButtonProps,
        ...overrideProps
      }
      return shallow(<Button {...buttonProps} />, {
        wrappingComponent: wrapWithTheme
      })
    }

    it('should call onPress event', () => {
      const onPress = jest.fn()
      const component = renderButton({ onPress })
      expect(onPress).not.toHaveBeenCalled()
      component.props().onPress()
      expect(mocked(onPress).mock.calls).toHaveLength(1)
    })

    it('should have disabled style when disabled is true', () => {
      const component = renderButton({ disabled: true })
      expectStylesToMatch(component, {
        backgroundColor: COLORS.lunesBlackUltralight
      })
    })

    it('should not have disabled style when disabled is false', () => {
      const component = renderButton()
      expectStylesNotToMatch(component, {
        backgroundColor: COLORS.lunesBlackUltralight
      })
    })

    it('should have dark style when theme is dark', () => {
      const component = renderButton({ buttonTheme: BUTTONS_THEME.dark })
      expectStylesToMatch(component, {
        backgroundColor: COLORS.lunesBlack
      })
    })

    it('should have light style when theme is light', () => {
      const component = renderButton({ buttonTheme: BUTTONS_THEME.light })

      expectStylesNotToMatch(component, {
        backgroundColor: COLORS.lunesBlack
      })
      expectStylesToMatch(component, {
        borderColor: COLORS.lunesBlack
      })
    })

    it('should render children passed to it', () => {
      const component = renderButton()
      expect(component.contains(defaultButtonProps.children)).toBe(true)
    })
  })
})
