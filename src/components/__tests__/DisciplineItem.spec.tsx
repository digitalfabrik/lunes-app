import { fireEvent, RenderAPI, waitFor } from '@testing-library/react-native'
import React from 'react'

import { COLORS } from '../../constants/theme/colors'
import render from '../../testing/render'
import DisciplineItem from '../DisciplineItem'

describe('DisciplineItem', () => {
  const onPress = jest.fn()
  const description = 'Wörter'
  const icon = 'https://example.com'
  const title = 'Discipline Item title'
  const badge = '12'

  const renderDisciplineItem = (): RenderAPI =>
    render(
      <DisciplineItem onPress={onPress} description={description} icon={icon} title={title} badgeLabel={badge} />
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

    fireEvent.press(arrowIcon)

    expect(onPress).toHaveBeenCalled()
    expect(arrowIcon.props.fill).toBe(COLORS.lunesRedLight)
    expect(getByText(title).instance.props.style[0].color).toBe(COLORS.white)

    await waitFor(() => {
      expect(arrowIcon.props.fill).toBe(COLORS.lunesBlack)
      expect(getByText(title).instance.props.style[0].color).toBe(COLORS.lunesGreyDark)
    })
  })
