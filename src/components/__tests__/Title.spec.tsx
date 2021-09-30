import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import React from 'react'
import { Text } from 'react-native'

import Title, { ITitleProps } from '../Title'

describe('Components', () => {
  describe('Title', () => {
    const defaultTitleProps: ITitleProps = {
      children: <Text>Title</Text>
    }

    it('renders correctly across screens', () => {
      const component = shallow(<Title {...defaultTitleProps} />)
      expect(toJson(component)).toMatchSnapshot()
    })

    it('should render title passed to it', () => {
      const titleProps: ITitleProps = {
        ...defaultTitleProps
      }

      const component = shallow(<Title {...titleProps} />)
      expect(component.contains(titleProps.children)).toBe(true)
    })
  })
})
