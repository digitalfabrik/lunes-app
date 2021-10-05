import { fireEvent, render, RenderAPI } from '@testing-library/react-native'
import React, { ComponentProps } from 'react'
import { Text } from 'react-native'

import { COLORS } from '../../constants/theme/colors'
import wrapWithTheme from '../../testing/wrapWithTheme'
import MenuItem from '../MenuItem'

describe('MenuItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const defaultMenuItemProps = {
    selected: false,
    icon: '',
    title: 'MenuItemTitle',
    children: <Text>description</Text>,
    onPress: jest.fn()
  }

  const renderMenuItem = (overrideProps: Partial<ComponentProps<typeof MenuItem>> = {}): RenderAPI => {
    return render(<MenuItem {...defaultMenuItemProps} {...overrideProps} />, { wrapper: wrapWithTheme })
  }

  it('should call onPress event', () => {
    const { getByText } = renderMenuItem()
    expect(defaultMenuItemProps.onPress).not.toHaveBeenCalled()
    const element = getByText(defaultMenuItemProps.title)
    fireEvent.press(element)
    expect(defaultMenuItemProps.onPress).toHaveBeenCalled()
  })

  it('should display title passed to it', () => {
    const { getByText } = renderMenuItem()
    expect(getByText(defaultMenuItemProps.title)).toBeTruthy()
  })

  it('should render children passed to it', () => {
    const childrenText = 'children'
    const { getByText } = renderMenuItem({ children: <Text>{childrenText}</Text> })
    expect(getByText(childrenText)).toBeTruthy()
  })

  it('should render black arrow icon when selected is false', () => {
    const { getByTestId } = renderMenuItem()
    expect(getByTestId('arrow').props.fill).toBe(COLORS.lunesBlack)
  })

  it('should render red arrow icon when selected is true', () => {
    const { getByTestId } = renderMenuItem({ selected: true })
    expect(getByTestId('arrow').props.fill).toBe(COLORS.lunesRedLight)
  })
})
