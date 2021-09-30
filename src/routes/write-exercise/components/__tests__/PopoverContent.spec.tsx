import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import React from 'react'
import 'react-native'

import PopoverContent from '../PopoverContent'

describe('components', () => {
  describe('PopoverContent', () => {
    it('renders correctly across screens', () => {
      const component = shallow(<PopoverContent />)
      expect(toJson(component)).toMatchSnapshot()
    })
  })
})
