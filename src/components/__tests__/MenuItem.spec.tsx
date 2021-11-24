import { fireEvent, render, RenderAPI } from '@testing-library/react-native'
import React, { ComponentProps } from 'react'
import { Text } from 'react-native'

import { COLORS } from '../../constants/theme/colors'
import wrapWithTheme from '../../testing/wrapWithTheme'
import MenuItem, { IMenuItemProps } from '../MenuItem'

describe('Components', () => {
  describe('MenuItem', () => {
    const defaultMenuItemProps: IMenuItemProps = {
      selected: false,
      item: {
        id: 1,
        description: '',
        icon: '',
        title: 'Menu item title',
        numberOfChildren: 1,
        isLeaf: false
      },
      children: <Text>Text of children</Text>,
      onPress: () => {}
    }

    const renderMenuItem = (overrideProps: Partial<ComponentProps<typeof MenuItem>> = {}): RenderAPI => {
      return render(<MenuItem {...defaultMenuItemProps} {...overrideProps} />, {
        wrapper: wrapWithTheme
      })
    }

    it('should call onPress event', () => {
      const onPress = jest.fn()
      const { getByText } = renderMenuItem({ onPress: onPress })
      expect(onPress).not.toHaveBeenCalled()
      const element = getByText('Menu item title')
      fireEvent.press(element)
      expect(onPress).toHaveBeenCalled()
    })

    it('should display title passed to it', () => {
      const { queryByText } = renderMenuItem({})
      const title = queryByText('Menu item title')
      expect(title).not.toBeNull()
    })

    it('should render children passed to it', () => {
      const { queryByText } = renderMenuItem()
      const title = queryByText('Text of children')
      expect(title).not.toBeNull()
    })

    it('should render black arrow icon when selected is false', () => {
      const { getByTestId, getByText } = renderMenuItem()
      const arrowIcon = getByTestId('arrow')
      expect(arrowIcon.props.fill).toBe(COLORS.lunesBlack)
      const title = getByText('Menu item title')
      expect(title.instance.props.style[0].color).toBe(COLORS.lunesGreyDark)
    })

    it('should render red arrow icon when selected is true', () => {
      const { getByTestId, getByText } = renderMenuItem({ selected: true })
      const arrowIcon = getByTestId('arrow')
      expect(arrowIcon.props.fill).toBe(COLORS.lunesRedLight)
      const title = getByText('Menu item title')
      expect(title.instance.props.style[0].color).toBe(COLORS.white)
    })
  })
})
