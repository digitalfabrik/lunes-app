import { fireEvent, RenderAPI, waitFor } from '@testing-library/react-native'
import React from 'react'

import { COLORS } from '../../constants/theme/colors'
import render from '../../testing/render'
import ListItem from '../ListItem'

describe('ListItem', () => {
  const onPress = jest.fn()
  const description = 'Wörter'
  const icon = 'https://example.com'
  const title = 'Discipline Item title'
  const badge = '12'

  const renderDisciplineItem = (disabled = false, arrowDisabled = false): RenderAPI =>
    render(
      <ListItem
        onPress={onPress}
        description={description}
        icon={icon}
        title={title}
        badgeLabel={badge}
        arrowDisabled={arrowDisabled}
        disabled={disabled}
      />
    )

  it('should render texts', () => {
    const { getByText } = renderDisciplineItem()
    expect(getByText(title)).toBeDefined()
    expect(getByText(description)).toBeDefined()
    expect(getByText(badge)).toBeDefined()
  })

  it('should handle press', async () => {
    const { getByTestId, getByText } = renderDisciplineItem()
    const arrowIcon = getByTestId('arrow')

    expect(arrowIcon.props.fill).toBe(COLORS.primary)
    expect(getByText(title).instance.props.style[0].color).toBe(COLORS.text)

    fireEvent(arrowIcon, 'pressIn', { nativeEvent: { pageY: 123 } })
    fireEvent(arrowIcon, 'pressOut', { nativeEvent: { pageY: 123 } })

    expect(onPress).toHaveBeenCalled()
    expect(arrowIcon.props.fill).toBe(COLORS.buttonSelectedSecondary)
    expect(getByText(title).instance.props.style[0].color).toBe(COLORS.backgroundAccent)

    await waitFor(() => {
      expect(arrowIcon.props.fill).toBe(COLORS.primary)
      expect(getByText(title).instance.props.style[0].color).toBe(COLORS.text)
    })
  })

  it('should show arrow disabled', async () => {
    const { getByTestId } = renderDisciplineItem(false, true)
    const arrowIcon = getByTestId('arrow')

    expect(arrowIcon.props.fill).toBe(COLORS.disabled)
  })

  it('should handle long press', async () => {
    const { getByTestId, getByText } = renderDisciplineItem()
    const arrowIcon = getByTestId('arrow')
    fireEvent(arrowIcon, 'pressIn', { nativeEvent: { pageY: 123 } })
    fireEvent(arrowIcon, 'longPress')

    expect(arrowIcon.props.fill).toBe(COLORS.buttonSelectedSecondary)
    expect(getByText(title).instance.props.style[0].color).toBe(COLORS.backgroundAccent)

    fireEvent(arrowIcon, 'pressOut', { nativeEvent: { pageY: 123 } })
    expect(onPress).toHaveBeenCalled()

    await waitFor(() => {
      expect(arrowIcon.props.fill).toBe(COLORS.primary)
      expect(getByText(title).instance.props.style[0].color).toBe(COLORS.text)
    })
  })

  it('should not call on press callback if scrolling', async () => {
    const { getByTestId } = renderDisciplineItem()
    const arrowIcon = getByTestId('arrow')

    expect(arrowIcon.props.fill).toBe(COLORS.primary)

    fireEvent(arrowIcon, 'pressIn', { nativeEvent: { pageY: 123 } })
    fireEvent(arrowIcon, 'pressOut', { nativeEvent: { pageY: 130 } })

    expect(onPress).not.toHaveBeenCalled()
    expect(arrowIcon.props.fill).toBe(COLORS.primary)
  })

  it('should have correct background color', () => {
    const { getByTestId } = renderDisciplineItem()
    expect(getByTestId('list-item').props.style[0].backgroundColor).toBe(COLORS.backgroundAccent)
  })

  it('should handle disable correctly', () => {
    const { getByTestId, getByText } = renderDisciplineItem(true)
    expect(getByTestId('list-item').props.style[0].backgroundColor).toBe(COLORS.disabled)
    fireEvent.press(getByText(title))
    expect(onPress).not.toHaveBeenCalled()
  })
})
