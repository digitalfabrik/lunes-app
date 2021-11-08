import { shallow } from 'enzyme'
import React from 'react'
import { View } from 'react-native'

import createNavigationPropMock from '../../testing/createNavigationPropMock'
import ConfirmationModal, { ConfirmationModalPropsType } from '../ConfirmationModal'

describe('Components', () => {
  describe('ConfirmationModal ', () => {
    const defaultModalProps: ConfirmationModalPropsType = {
      navigation: createNavigationPropMock(),
      route: {
        key: '',
        name: 'WordChoiceExercise',
        params: {
          discipline: {
            id: 0,
            title: 'Title',
            numberOfChildren: 0,
            isLeaf: false
          }
        }
      },
      setIsModalVisible: () => {},
      visible: false
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
