import { render, RenderAPI } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import { CorrectEntriesIcon } from '../../../assets/images'
import wrapWithTheme from '../../testing/wrapWithTheme'
import ListTitle from '../ListTitle'

describe('ListTitle', () => {
  const defaultTitleProps: React.ComponentProps<typeof ListTitle> = {
    title: 'Title',
    description: 'Description'
  }

  const renderListTitle = (otherProps: Partial<React.ComponentProps<typeof ListTitle>> = {}): RenderAPI => {
    return render(<ListTitle {...defaultTitleProps} {...otherProps} />, { wrapper: wrapWithTheme })
  }

  it('should render ListTitle with title and description', () => {
    const { getByText } = renderListTitle()

    expect(getByText(defaultTitleProps.title)).toBeTruthy()
    expect(getByText(defaultTitleProps.description)).toBeTruthy()
  })

  it('should render ListTitle with subtitle icon and children', () => {
    const subtitle = 'Subtitle'
    const titleIcon = <CorrectEntriesIcon accessibilityLabel='correct' />
    const childText = 'Child'
    const { getByText, getByA11yLabel } = renderListTitle({ subtitle, titleIcon, children: <Text>{childText}</Text> })

    expect(getByText(defaultTitleProps.title)).toBeTruthy()
    expect(getByText(defaultTitleProps.description)).toBeTruthy()
    expect(getByText(subtitle)).toBeTruthy()
    expect(getByText(childText)).toBeTruthy()
    expect(getByA11yLabel('correct')).toBeTruthy()
  })
})
