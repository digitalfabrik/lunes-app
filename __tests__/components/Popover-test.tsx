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

    // it('should not be rendered when isVisible is false', () => {
    //   const popoverProps: IPopoverProps = {
    //     ...defaultPopoverProps
    //   };

    //   const component = shallow(<Popover {...popoverProps}/>);
    //   expect(component.contains(popoverProps.children)).toBe(false);
    // });
  });
});
