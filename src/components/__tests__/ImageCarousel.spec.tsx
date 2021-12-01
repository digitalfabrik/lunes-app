import { render, RenderAPI } from '@testing-library/react-native'
import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'

import wrapWithTheme from '../../testing/wrapWithTheme'
import ImageCarousel from '../ImageCarousel'

jest.mock('react-native/Libraries/Image/Image', () => {
  return {
    ...jest.requireActual('react-native/Libraries/Image/Image'),
    getSize: (uri: string, success: (w: number, h: number) => void) => {
      success(1234, 1234)
    }
  }
})

describe('ImageCarousel ', () => {
  const images = [
    {
      id: 0,
      image: 'Arbeitshose'
    },
    {
      id: 1,
      image: 'Arbeitsschuhe'
    }
  ]
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderImageCarousel = (): RenderAPI => {
    return render(<ImageCarousel images={images} />, { wrapper: wrapWithTheme })
  }

  const getUri = (image: ReactTestInstance): string => image.props.source[0].uri

  it('should render images', async () => {
    const { getByTestId, findAllByRole } = renderImageCarousel()

    const row = getByTestId('Swipeable')
    expect(row).toBeTruthy()
    const swipeable = row.children[0] as ReactTestInstance
    swipeable.instance.loadImage(1) // preload the second image

    const displayedImages = await findAllByRole('image')
    expect(displayedImages).toHaveLength(2)

    const firstImage = displayedImages[0]
    expect(getUri(firstImage)).toBe('Arbeitshose')

    const secondImage = displayedImages[1]
    expect(getUri(secondImage)).toBe('Arbeitsschuhe')
  })
})
