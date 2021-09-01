import { View } from 'react-native'
import React from 'react'
import Modal, { ConfirmationModalPropsType } from '../ConfirmationModal'
import { shallow } from 'enzyme'

describe('Components', () => {
  describe('ConfirmationModal ', () => {
    const defaultModalProps: ConfirmationModalPropsType = {
      navigation: '',
      setIsModalVisible: () => {},
      visible: false
    }

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
