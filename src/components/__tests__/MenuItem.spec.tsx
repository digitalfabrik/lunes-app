import { fireEvent, render } from '@testing-library/react-native'
import { shallow } from 'enzyme'
import React from 'react'
import { Text } from 'react-native'

import { COLORS } from '../../constants/theme/colors'
import wrapWithTheme from '../../testing/wrapWithTheme'
import MenuItem, { IMenuItemProps } from '../MenuItem'

describe('Components', () => {
  describe('MenuItem', () => {
    const defaultMenuItemProps: IMenuItemProps = {
      selected: false,
      icon: '',
      title: 'MenuItemTitle',
      children: <Text>description</Text>,
      onPress: () => {}
    }

    it('should call onPress event', () => {
      const menuItemProps: IMenuItemProps = {
        ...defaultMenuItemProps,
        onPress: jest.fn()
      }

      const { getByText } = render(<MenuItem {...menuItemProps} />, { wrapper: wrapWithTheme })
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

      const component = shallow(<MenuItem {...menuItemProps} />, { wrappingComponent: wrapWithTheme })
      expect(component.find('[testID="title"]').props().children).toBe(menuItemProps.title)
    })

    it('should render children passed to it', () => {
      const menuItemProps: IMenuItemProps = {
        ...defaultMenuItemProps
      }

      const component = shallow(<MenuItem {...menuItemProps} />)
      expect(component.contains(menuItemProps.children)).toBe(true)
    })

    it('should render black arrow icon when selected is false', () => {
      const menuItemProps: IMenuItemProps = {
        ...defaultMenuItemProps
      }

      const component = shallow(<MenuItem {...menuItemProps} />)
      expect(component.find('[testID="arrow"]').props().fill).toBe(COLORS.lunesBlack)
    })

    it('should render red arrow icon when selected is true', () => {
      const menuItemProps: IMenuItemProps = {
        ...defaultMenuItemProps,
        selected: true
      }

      const component = shallow(<MenuItem {...menuItemProps} />)
      expect(component.find('[testID="arrow"]').props().fill).toBe(COLORS.lunesRedLight)
    })
  })
})
