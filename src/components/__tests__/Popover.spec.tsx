import 'react-native';
import React from 'react';
import Popover from '../Popover';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {IPopoverProps} from '../../interfaces';
import {Text} from 'react-native';

describe('Components', () => {
  describe('Popover', () => {
    const defaultPopoverProps: IPopoverProps = {
      children: <Text>children</Text>,
      isVisible: true,
      setIsPopoverVisible: () => {},
    };

    it('renders correctly across screens', () => {
      const component = shallow(<Popover {...defaultPopoverProps} />);
      expect(toJson(component)).toMatchSnapshot();
    });

    it('should have visible property passed to it', () => {
      const popoverProps: IPopoverProps = {
        ...defaultPopoverProps,
      };

      const component = shallow(<Popover {...popoverProps} />);
      expect(component.props().isVisible).toBe(true);
    });

    it('should have visible property passed to it', () => {
      const popoverProps: IPopoverProps = {
        ...defaultPopoverProps,
        isVisible: false,
      };

      const component = shallow(<Popover {...popoverProps} />);
      expect(component.props().isVisible).toBe(false);
    });

    it('should render children passed to it', () => {
      const component = shallow(<Popover {...defaultPopoverProps} />);
      expect(component.contains(defaultPopoverProps.children)).toBe(true);
    });
  });
});
