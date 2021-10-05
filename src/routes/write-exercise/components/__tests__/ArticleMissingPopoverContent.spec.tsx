import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import React from 'react'
import 'react-native'

import ArticleMissingPopoverContent from '../ArticleMissingPopoverContent'

describe('components', () => {
  describe('ArticleMissingPopoverContent', () => {
    it('renders correctly across screens', () => {
      const component = shallow(<ArticleMissingPopoverContent />)
      expect(toJson(component)).toMatchSnapshot()
    })
  })
})
