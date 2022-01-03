import { fireEvent, render, RenderAPI } from '@testing-library/react-native'
import React, { ComponentProps } from 'react'
import { Text } from 'react-native'

import { COLORS } from '../../constants/theme/colors'
import wrapWithTheme from '../../testing/wrapWithTheme'
import DisciplineItem, { DisciplineItemProps } from '../DisciplineItem'

describe('Components', () => {
  describe('DisciplineItem', () => {
    const defaultDisciplineItemProps: DisciplineItemProps = {
      selected: false,
      item: {
        id: 1,
        description: '',
        icon: '',
        title: 'Discipline Item title',
        numberOfChildren: 1,
        isLeaf: false,
        isRoot: true,
        needsTrainingSetEndpoint: false
      },
      children: <Text>Text of children</Text>,
      onPress: () => {}
    }

    const renderDisciplineItem = (overrideProps: Partial<ComponentProps<typeof DisciplineItem>> = {}): RenderAPI => {
      return render(<DisciplineItem {...defaultDisciplineItemProps} {...overrideProps} />, {
        wrapper: wrapWithTheme
      })
    }

    it('should call onPress event', () => {
      const onPress = jest.fn()
      const { getByText } = renderDisciplineItem({ onPress: onPress })
      expect(onPress).not.toHaveBeenCalled()
      const element = getByText('Menu item title')
      fireEvent.press(element)
      expect(onPress).toHaveBeenCalled()
    })

    it('should display title passed to it', () => {
      const { queryByText } = renderDisciplineItem({})
      const title = queryByText('Menu item title')
      expect(title).not.toBeNull()
    })

    it('should render children passed to it', () => {
      const { queryByText } = renderDisciplineItem()
      const title = queryByText('Text of children')
      expect(title).not.toBeNull()
    })

    it('should render black arrow icon when selected is false', () => {
      const { getByTestId, getByText } = renderDisciplineItem()
      const arrowIcon = getByTestId('arrow')
      expect(arrowIcon.props.fill).toBe(COLORS.lunesBlack)
      const title = getByText('Displine Item title')
      expect(title.instance.props.style[0].color).toBe(COLORS.lunesGreyDark)
    })

    it('should render red arrow icon when selected is true', () => {
      const { getByTestId, getByText } = renderDisciplineItem({ selected: true })
      const arrowIcon = getByTestId('arrow')
      expect(arrowIcon.props.fill).toBe(COLORS.lunesRedLight)
      const title = getByText('Displine Item title')
      expect(title.instance.props.style[0].color).toBe(COLORS.white)
    })
  })
})
