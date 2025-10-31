import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'

import render from '../../testing/render'
import ImageCarousel from '../ImageCarousel'

jest.mock('react-native/Libraries/Image/Image', () => ({
  ...jest.requireActual('react-native/Libraries/Image/Image'),
  getSize: (uri: string, success: (w: number, h: number) => void) => {
    success(1234, 1234)
  },
}))

describe('ImageCarousel', () => {
  const images = ['Arbeitshose', 'Arbeitsschuhe']

  const getUri = (image: ReactTestInstance): string => image.props.source[0].uri

  it('should display the images', async () => {
    const { getByTestId, getAllByTestId } = render(<ImageCarousel images={images} />)

    const row = getByTestId('Swipeable')
    expect(row).toBeTruthy()
    const swipeable = row.children[0] as ReactTestInstance

    const displayedImages = getAllByTestId('image')
    expect(displayedImages).toHaveLength(1)

    const firstImage = displayedImages[0]
    expect(getUri(firstImage)).toBe('Arbeitshose')

    // the react-native-image-zoom library renders the images in a row next to each other
    // images which were not yet loaded don't have a size and are therefore only rendered as an empty View
    // swiping to the next image triggers loadImage and goNext, but we only care about loadImage
    // as the image is then rendered and accessible by role, even without swiping
    swipeable.instance.loadImage(1) // load the second image

    const swipedDisplayedImages = getAllByTestId('image')
    expect(swipedDisplayedImages).toHaveLength(2)

    const swipedFirstImage = swipedDisplayedImages[0]
    expect(swipedFirstImage).toBe(firstImage)

    const secondImage = swipedDisplayedImages[1]
    expect(getUri(secondImage)).toBe('Arbeitsschuhe')
  })
})
