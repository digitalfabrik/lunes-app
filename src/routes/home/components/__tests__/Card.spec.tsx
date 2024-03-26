import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import render from '../../../../testing/render'
import Card from '../Card'

describe('Card', () => {
  const press = jest.fn()
  it('should render correctly', () => {
    const { getByText } = render(
      <Card heading='heading' onPress={press}>
        <Text>children-text</Text>
      </Card>,
    )
    const heading = getByText('heading')
    expect(heading).toBeDefined()
    expect(getByText('children-text')).toBeDefined()
    fireEvent.press(heading)
    expect(press).toHaveBeenCalled()
  })
})
