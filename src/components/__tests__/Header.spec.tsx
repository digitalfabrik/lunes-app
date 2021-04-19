import 'react-native';
import React from 'react';
import Header from '../Header';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {IHeaderProps} from '../../interfaces/header';

describe('Components', () => {
  describe('Header', () => {
    const defaultHeaderProps: IHeaderProps = {
      top: 5,
    };

    it('renders correctly across screens', () => {
      const component = shallow(<Header {...defaultHeaderProps} />);
      expect(toJson(component)).toMatchSnapshot();
    });

    it('should have top padding = top prop passed to it', () => {
      const headerProps: IHeaderProps = {
        ...defaultHeaderProps,
      };
      const paddingTop = 5;

      const component = shallow(<Header {...headerProps} />);
      expect(component.find('[testID="header"]').props().style).toHaveProperty(
        'paddingTop',
        paddingTop,
      );
    });
  });
});
