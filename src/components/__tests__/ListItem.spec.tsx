import { fireEvent, RenderAPI, waitFor } from '@testing-library/react-native'
import React from 'react'

import { COLORS } from '../../constants/theme/colors'
import render from '../../testing/render'
import ListItem from '../ListItem'

jest.mock('@react-navigation/native')
describe('ListItem', () => {
  const onPress = jest.fn()
  const description = 'Wörter'
  const icon = 'https://example.com'
  const title = 'Item title'
  const badge = '12'

  const renderListItem = (disabled = false, arrowDisabled = false): RenderAPI =>
    render(
      <ListItem
        onPress={onPress}
        description={description}
        icon={icon}
        title={title}
        badgeLabel={badge}
        arrowDisabled={arrowDisabled}
        disabled={disabled}
      />,
    )

  it('should render texts', () => {
    const { getByText } = renderListItem()
    expect(getByText(title)).toBeDefined()
    expect(getByText(description)).toBeDefined()
    expect(getByText(badge)).toBeDefined()
  })

  it('should handle press', async () => {
    const { getByTestId, getByText } = renderListItem()
    const arrowIcon = getByTestId('arrow')

    expect(arrowIcon.props.fill).toBe(COLORS.primary)
    expect(getByText(title)).toHaveStyle({ color: COLORS.text })

    fireEvent(arrowIcon, 'pressIn', { nativeEvent: { pageY: 123 } })
    fireEvent(arrowIcon, 'pressOut', { nativeEvent: { pageY: 123 } })

    expect(onPress).toHaveBeenCalled()
    expect(arrowIcon.props.fill).toBe(COLORS.buttonSelectedSecondary)
    expect(getByText(title)).toHaveStyle({ color: COLORS.backgroundAccent })

    await waitFor(() => {
      expect(arrowIcon.props.fill).toBe(COLORS.primary)
      expect(getByText(title)).toHaveStyle({ color: COLORS.text })
    })
  })

  it('should show arrow disabled', async () => {
    const { getByTestId } = renderListItem(false, true)
    const arrowIcon = getByTestId('arrow')

    expect(arrowIcon.props.fill).toBe(COLORS.disabled)
  })

  it('should handle long press', async () => {
    const { getByTestId, getByText } = renderListItem()
    const arrowIcon = getByTestId('arrow')
    fireEvent(arrowIcon, 'pressIn', { nativeEvent: { pageY: 123 } })
    fireEvent(arrowIcon, 'longPress')

    expect(arrowIcon.props.fill).toBe(COLORS.buttonSelectedSecondary)
    expect(getByText(title)).toHaveStyle({ color: COLORS.backgroundAccent })

    fireEvent(arrowIcon, 'pressOut', { nativeEvent: { pageY: 123 } })
    expect(onPress).toHaveBeenCalled()

    await waitFor(() => {
      expect(arrowIcon.props.fill).toBe(COLORS.primary)
      expect(getByText(title)).toHaveStyle({ color: COLORS.text })
    })
  })

  it('should not call on press callback if scrolling', async () => {
    const { getByTestId } = renderListItem()
    const arrowIcon = getByTestId('arrow')

    expect(arrowIcon.props.fill).toBe(COLORS.primary)

    fireEvent(arrowIcon, 'pressIn', { nativeEvent: { pageY: 123 } })
    fireEvent(arrowIcon, 'pressOut', { nativeEvent: { pageY: 130 } })

    expect(onPress).not.toHaveBeenCalled()
    expect(arrowIcon.props.fill).toBe(COLORS.primary)
  })

  it('should have correct background color', () => {
    const { getByTestId } = renderListItem()
    expect(getByTestId('list-item')).toHaveStyle({ backgroundColor: COLORS.backgroundAccent })
  })

  it('should handle disable correctly', () => {
    const { getByTestId, getByText } = renderListItem(true)
    expect(getByTestId('list-item')).toHaveStyle({ backgroundColor: COLORS.disabled })
    fireEvent.press(getByText(title))
    expect(onPress).not.toHaveBeenCalled()
  })
})
