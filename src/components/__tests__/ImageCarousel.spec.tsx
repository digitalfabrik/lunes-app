import React from 'react'
import { render } from '@testing-library/react-native'
import ImageCarousel from '../ImageCarousel'

describe('Components', () => {
  const images = [
    {
      id: 1,
      image: '1'
    },
    {
      id: 2,
      image: '2'
    }
  ]
  describe('ImageCarousel', () => {
    it('should render correctly', function () {
      const { getAllByTestId } = render(<ImageCarousel images={images} />)
      expect(getAllByTestId('carousel-image')).toHaveLength(2)
    })
  })
})
