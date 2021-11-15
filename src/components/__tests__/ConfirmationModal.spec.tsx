import { shallow } from 'enzyme'
import React from 'react'
import { View } from 'react-native'

import ConfirmationModal, { ConfirmationModalPropsType } from '../ConfirmationModal'

describe('Components', () => {
  describe('ConfirmationModal ', () => {
    const defaultModalProps: ConfirmationModalPropsType = {
      visible: false,
      setVisible: (input: boolean) => {},
      text: 'Are you sure?',
      confirmationButtonText: 'confirm',
      cancelButtonText: 'cancel',
      confirmationAction: () => {}
    }

    it('should have visible property passed to it as default', () => {
      const modalProps: ConfirmationModalPropsType = {
        ...defaultModalProps
      }

      const component = shallow(
        <View>
          <ConfirmationModal {...modalProps} />
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
          <ConfirmationModal {...modalProps} />
        </View>
      )
      expect(component.children().props().visible).toBe(true)
    })
  })
})
