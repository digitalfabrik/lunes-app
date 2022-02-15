import { fireEvent, render, RenderAPI } from '@testing-library/react-native'
import React, { ComponentProps } from 'react'

import { ArrowLeftCircleIconWhite, ArrowRightIcon } from '../../../assets/images'
import { BUTTONS_THEME } from '../../constants/data'
import { COLORS } from '../../constants/theme/colors'
import wrapWithTheme from '../../testing/wrapWithTheme'
import Button from '../Button'

import resetAllMocks = jest.resetAllMocks

type ButtonProps = ComponentProps<typeof Button>

describe('Button', () => {
  const onPressMock = jest.fn()

  beforeEach(() => {
    resetAllMocks()
  })

  const renderButton = (overrideProps: Partial<ButtonProps> = {}): RenderAPI => {
    const buttonProps = {
      onPress: onPressMock,
      label: 'Button label',
      buttonTheme: BUTTONS_THEME.outlined,
      ...overrideProps
    }
    return render(<Button {...buttonProps} />, { wrapper: wrapWithTheme })
  }

  it('should render label and icons', () => {
    const { getByText, queryByTestId } = renderButton({
      iconLeft: ArrowRightIcon,
      iconRight: ArrowLeftCircleIconWhite
    })
    expect(getByText('Button label')).toBeDefined()
    expect(queryByTestId('button-icon-left')).toBeDefined()
    expect(queryByTestId('button-icon-right')).toBeDefined()
  })

  it('should render label and no icons', () => {
    const { getByText, queryByTestId } = renderButton()
    expect(getByText('Button label')).toBeDefined()
    expect(queryByTestId('button-icon-left')).toBeNull()
    expect(queryByTestId('button-icon-right')).toBeNull()
  })

  it('should call onClick', () => {
    const { getByText } = renderButton()
    const button = getByText('Button label')
    fireEvent.press(button)
    expect(onPressMock).toHaveBeenCalled()
  })

  it('should not call onClick when disabled', () => {
    const { getByText } = renderButton({ disabled: true })
    const button = getByText('Button label')
    fireEvent.press(button)
    expect(onPressMock).not.toHaveBeenCalled()
  })

  it('should have correct style when light theme', () => {
    const { getByTestId, getByText } = renderButton({ buttonTheme: BUTTONS_THEME.outlined })
    expect(getByTestId('button').props.style.backgroundColor).toBe('transparent')
    expect(getByTestId('button').props.style.borderColor).toBe(COLORS.lunesBlack)
    expect(getByText('Button label').props.style[0].color).toBe(COLORS.lunesBlack)
  })

  it('should have correct style when dark theme', () => {
    const { getByTestId, getByText } = renderButton({ buttonTheme: BUTTONS_THEME.contained })
    expect(getByTestId('button').props.style.backgroundColor).toEqual(COLORS.lunesBlack)
    expect(getByTestId('button').props.style.borderColor).toBeUndefined()
    expect(getByText('Button label').props.style[0].color).toBe(COLORS.lunesWhite)
  })

  it('should have correct style when no-outline theme', () => {
    const { getByTestId, getByText } = renderButton({ buttonTheme: BUTTONS_THEME.text })
    expect(getByTestId('button').props.style.backgroundColor).toBe('transparent')
    expect(getByTestId('button').props.style.borderColor).toBeUndefined()
    expect(getByText('Button label').props.style[0].color).toBe(COLORS.lunesBlack)
  })

  it('should have correct style when disabled', () => {
    const { getByTestId, getByText } = renderButton({ disabled: true })
    expect(getByTestId('button').props.style.backgroundColor).toBe(COLORS.lunesBlackUltralight)
    expect(getByTestId('button').props.style.borderColor).toBeUndefined()
    expect(getByText('Button label').props.style[0].color).toBe(COLORS.lunesBlackLight)
  })
})
