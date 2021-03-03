import 'react-native';
import React from 'react';
import Popover from '../../components/Popover';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {IPopoverProps} from '../../interfaces/index';
import {Text} from 'react-native';

describe('Components', () => {
  describe('Popover', () => {
    const defaultPopoverProps: IPopoverProps = {
      children: <Text>children</Text>,
      isVisible: false,
      setIsPopoverVisible: () => {},
    };

    it('renders correctly across screens', () => {
      const component = shallow(<Popover {...defaultPopoverProps} />);
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
