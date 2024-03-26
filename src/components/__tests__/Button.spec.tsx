import { fireEvent, RenderAPI } from '@testing-library/react-native'
import React, { ComponentProps } from 'react'

import { ArrowLeftCircleIconWhite, ArrowRightIcon } from '../../../assets/images'
import { BUTTONS_THEME } from '../../constants/data'
import { COLORS } from '../../constants/theme/colors'
import render from '../../testing/render'
import Button from '../Button'

type ButtonProps = ComponentProps<typeof Button>

describe('Button', () => {
  const onPressMock = jest.fn()

  const renderButton = (overrideProps: Partial<ButtonProps> = {}): RenderAPI => {
    const buttonProps = {
      onPress: onPressMock,
      label: 'Button label',
      buttonTheme: BUTTONS_THEME.outlined,
      ...overrideProps,
    }
    return render(<Button {...buttonProps} />)
  }

  it('should render label and icons', () => {
    const { getByText, queryByTestId } = renderButton({
      iconLeft: ArrowRightIcon,
      iconRight: ArrowLeftCircleIconWhite,
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
    expect(getByTestId('button')).toHaveStyle({ backgroundColor: 'transparent' })
    expect(getByTestId('button')).toHaveStyle({ borderColor: COLORS.primary })
    expect(getByText('Button label')).toHaveStyle({ color: COLORS.primary })
  })

  it('should have correct style when dark theme', () => {
    const { getByTestId, getByText } = renderButton({ buttonTheme: BUTTONS_THEME.contained })
    expect(getByTestId('button')).toHaveStyle({ backgroundColor: COLORS.primary })
    expect(getByTestId('button')).not.toHaveStyle({ borderColor: expect.anything() })
    expect(getByText('Button label')).toHaveStyle({ color: COLORS.background })
  })

  it('should have correct style when no-outline theme', () => {
    const { getByTestId, getByText } = renderButton({ buttonTheme: BUTTONS_THEME.text })
    expect(getByTestId('button')).toHaveStyle({ backgroundColor: 'transparent' })
    expect(getByTestId('button')).not.toHaveStyle({ borderColor: expect.anything() })
    expect(getByText('Button label')).toHaveStyle({ color: COLORS.primary })
  })

  it('should have correct style when disabled', () => {
    const { getByTestId, getByText } = renderButton({ disabled: true })
    expect(getByTestId('button')).toHaveStyle({ backgroundColor: COLORS.disabled })
    expect(getByTestId('button')).not.toHaveStyle({ borderColor: expect.anything() })
    expect(getByText('Button label')).toHaveStyle({ color: COLORS.placeholder })
  })
})
