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
          extraParams: {
            disciplineID: 0,
            disciplineTitle: 'Title',
            disciplineIcon: 'Icon',
            trainingSetId: 0,
            trainingSet: 'Set',
            exercise: 1,
            exerciseDescription: 'Description',
            level: jest.fn(),
            documentsLength: 0
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
