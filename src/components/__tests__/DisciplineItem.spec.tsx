import { fireEvent, render, RenderAPI } from '@testing-library/react-native'
import React from 'react'

import { COLORS } from '../../constants/theme/colors'
import wrapWithTheme from '../../testing/wrapWithTheme'
import DisciplineItem from '../DisciplineItem'

describe('DisciplineItem', () => {
  const onPress = jest.fn()
  const description = 'Wörter'
  const icon = 'https://example.com'
  const title = 'Discipline Item title'
  const badge = '12'

  const renderDisciplineItem = (): RenderAPI =>
    render(
      <DisciplineItem onPress={onPress} description={description} icon={icon} title={title} badgeLabel={badge} />,
      {
        wrapper: wrapWithTheme
      }
    )

  it('should render texts', () => {
    const { getByText } = renderDisciplineItem()
    expect(getByText(title)).toBeDefined()
    expect(getByText(description)).toBeDefined()
    expect(getByText(badge)).toBeDefined()
  })

  it('should call onPress event', () => {
    const { getByText } = renderDisciplineItem()
    expect(onPress).not.toHaveBeenCalled()
    const element = getByText(title)
    fireEvent.press(element)
    expect(onPress).toHaveBeenCalled()
  })

  it('should render black arrow icon when not pressed', () => {
    const { getByTestId, getByText } = renderDisciplineItem()
    const arrowIcon = getByTestId('arrow')
    expect(arrowIcon.props.fill).toBe(COLORS.lunesBlack)
    expect(getByText(title).instance.props.style[0].color).toBe(COLORS.lunesGreyDark)
  })

  it('should adjust style when pressed', () => {
    const { getByTestId, getByText } = renderDisciplineItem()
    const arrowIcon = getByTestId('arrow')

    fireEvent(arrowIcon, 'onPressIn')

    expect(arrowIcon.props.fill).toBe(COLORS.lunesRedLight)
    expect(getByText(title).instance.props.style[0].color).toBe(COLORS.white)
  })
})
