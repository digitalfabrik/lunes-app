import 'react-native';
import React from 'react';
import PopoverContent from '../PopoverContent';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

describe('components', () => {
  describe('PopoverContent', () => {
    it('renders correctly across screens', () => {
      const component = shallow(<PopoverContent />);
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
