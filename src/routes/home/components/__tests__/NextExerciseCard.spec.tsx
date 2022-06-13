import React from 'react'

import render from '../../../../testing/render'
import NextExerciseCard from '../NextExerciseCard'

describe('NextExerciseCard', () => {
  const onPress = jest.fn()

  it('should render correctly', async () => {
    const { getByText, findByRole } = render(
      <NextExerciseCard
        thumbnail='thumbnail-uri'
        heading='heading'
        subheading='subheading'
        buttonLabel='button'
        onPress={onPress}
      />
    )
    expect(getByText('heading')).toBeDefined()
    expect(getByText('subheading')).toBeDefined()
    const image = await findByRole('image')
    expect(image.props.source.uri).toBe('thumbnail-uri')
  })
})
