import 'react-native'
import React from 'react'
import Title from '../Title'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { Text } from 'react-native'
import { ITitleProps } from '../../interfaces/title'

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
