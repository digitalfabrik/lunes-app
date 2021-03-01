import 'react-native';
import React from 'react';
import Modal from '../../components/Modal';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {View} from 'react-native';
import {IConfirmationModalProps} from '../../interfaces/exercise';

describe('Components', () => {
  describe('Modal ', () => {
    const defaultModalProps: IConfirmationModalProps = {
      navigation: '',
      setIsModalVisible: () => {},
      visible: false,
    };

    it('renders correctly across screens', () => {
      const component = shallow(
        <View>
          <Modal {...defaultModalProps} />
        </View>,
      );
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
