import { RenderAPI } from '@testing-library/react-native'
import React, { ComponentProps } from 'react'
import { Text } from 'react-native'

import { CheckCircleIcon } from '../../../assets/images'
import render from '../../testing/render'
import Title from '../Title'

describe('Title', () => {
  const defaultTitleProps: ComponentProps<typeof Title> = {
    title: 'Title',
    description: 'Description',
  }

  const renderListTitle = (otherProps: Partial<ComponentProps<typeof Title>> = {}): RenderAPI =>
    render(<Title {...defaultTitleProps} {...otherProps} />)

  it('should render ListTitle with title and description', () => {
    const { getByText } = renderListTitle()

    expect(getByText(defaultTitleProps.title)).toBeTruthy()
    expect(getByText(defaultTitleProps.description)).toBeTruthy()
  })

  it('should render ListTitle with subtitle icon and children', () => {
    const subtitle = 'Subtitle'
    const titleIcon = <CheckCircleIcon accessibilityLabel='correct' />
    const childText = 'Child'
    const { getByText, getByLabelText } = renderListTitle({ subtitle, titleIcon, children: <Text>{childText}</Text> })

    expect(getByText(defaultTitleProps.title)).toBeTruthy()
    expect(getByText(defaultTitleProps.description)).toBeTruthy()
    expect(getByText(subtitle)).toBeTruthy()
    expect(getByText(childText)).toBeTruthy()
    expect(getByLabelText('correct')).toBeTruthy()
  })
})
