import { View } from 'react-native'
import React from 'react'
import Modal, { ConfirmationModalPropsType } from '../Modal'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe('Components', () => {
  describe('Modal ', () => {
    const defaultModalProps: ConfirmationModalPropsType = {
      navigation: '',
      setIsModalVisible: () => {},
      visible: false
    }

    it('renders correctly across screens', () => {
      const component = shallow(
        <View>
          <Modal {...defaultModalProps} />
        </View>
      )
      expect(toJson(component)).toMatchSnapshot()
    })

    it('should have visible property passed to it as default', () => {
      const modalProps: ConfirmationModalPropsType = {
        ...defaultModalProps
      }

      const component = shallow(
        <View>
          <Modal {...modalProps} />
        </View>
      )
      expect(component.children().props().visible).toBe(false)
    })

    it('should have visible property passed to it', () => {
      const modalProps: ConfirmationModalPropsType = {
        ...defaultModalProps,
        visible: true
      }

      const component = shallow(
        <View>
          <Modal {...modalProps} />
        </View>
      )
      expect(component.children().props().visible).toBe(true)
    })
  })
})
