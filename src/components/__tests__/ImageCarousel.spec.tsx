import React from 'react'

import render from '../../testing/render'
import ImageCarousel from '../ImageCarousel'

describe('ImageCarousel', () => {
  const images = ['Arbeitshose', 'Arbeitsschuhe']

  it('should display all images', () => {
    const { getAllByTestId } = render(<ImageCarousel images={images} />)

    const displayedImages = getAllByTestId('image')
    expect(displayedImages).toHaveLength(2)
    expect(displayedImages[0]!.props.src).toBe('Arbeitshose')
    expect(displayedImages[1]!.props.src).toBe('Arbeitsschuhe')
  })
})
