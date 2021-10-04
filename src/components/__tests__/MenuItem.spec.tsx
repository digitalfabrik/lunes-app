import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import { COLORS } from '../../constants/theme/colors'
import MenuItem, { IMenuItemProps } from '../MenuItem'

describe('Components', () => {
  describe('MenuItem', () => {
    const defaultMenuItemProps: IMenuItemProps = {
      selected: false,
      icon: '',
      title: 'MenuItemTitle',
      children: <Text>Text of children</Text>,
      onPress: () => {}
    }

    it('should call onPress event', () => {
      const menuItemProps: IMenuItemProps = {
        ...defaultMenuItemProps,
        onPress: jest.fn()
      }
      const { getByText } = render(<MenuItem {...menuItemProps} />)
      expect(menuItemProps.onPress).not.toHaveBeenCalled()
      const element = getByText('MenuItemTitle')
      fireEvent.press(element)
      expect(menuItemProps.onPress).toHaveBeenCalled()
    })

    it('should display title passed to it', () => {
      const menuItemProps: IMenuItemProps = {
        ...defaultMenuItemProps,
        title: 'Menu item title'
      }

      const { queryByText } = render(<MenuItem {...menuItemProps} />)
      const title = queryByText('Menu item title')
      expect(title).not.toBeNull()
    })

    it('should render children passed to it', () => {
      const menuItemProps: IMenuItemProps = {
        ...defaultMenuItemProps
      }

      const { queryByText } = render(<MenuItem {...menuItemProps} />)
      const title = queryByText('Text of children')
      expect(title).not.toBeNull()
    })

    it('should render black arrow icon when selected is false', () => {
      const menuItemProps: IMenuItemProps = {
        ...defaultMenuItemProps
      }

      const { getByTestId, getByText } = render(<MenuItem {...menuItemProps} />)
      const arrowIcon = getByTestId('arrow')
      expect(arrowIcon.props.fill).toBe(COLORS.lunesBlack)
      const title = getByText('MenuItemTitle')
      // @ts-expect-error
      expect(title._fiber.pendingProps.style[0].color).toBe(COLORS.lunesGreyDark)
    })

    it('should render red arrow icon when selected is true', () => {
      const menuItemProps: IMenuItemProps = {
        ...defaultMenuItemProps,
        selected: true
      }

      const { getByTestId, getByText } = render(<MenuItem {...menuItemProps} />)
      const arrowIcon = getByTestId('arrow')
      expect(arrowIcon.props.fill).toBe(COLORS.lunesRedLight)
      const title = getByText('MenuItemTitle')
      // @ts-expect-error
      expect(title._fiber.pendingProps.style[0].color).toBe(COLORS.white)
    })
  })
})
