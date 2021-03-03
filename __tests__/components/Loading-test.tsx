import 'react-native';
import React from 'react';
import Loading from '../../components/Loading';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {Text} from 'react-native';
import {ILoadingProps} from '../../interfaces/index';

describe('Components', () => {
  describe('Loading ', () => {
    const defaultLoadingProps: ILoadingProps = {
      isLoading: true,
      children: <Text>Test Children</Text>,
    };

    it('renders correctly across screens', () => {
      const component = shallow(<Loading {...defaultLoadingProps} />);
      expect(toJson(component)).toMatchSnapshot();
    });

    it('should not render children when isLoading is true', () => {
      const loadingProps: ILoadingProps = {
        ...defaultLoadingProps,
      };

      const component = shallow(<Loading {...loadingProps} />);
      expect(component.contains(loadingProps.children)).toBe(false);
    });

    it('should render children when isLoading is false', () => {
      const loadingProps: ILoadingProps = {
        ...defaultLoadingProps,
        isLoading: false,
      };

      const component = shallow(<Loading {...loadingProps} />);
      expect(component.contains(loadingProps.children)).toBe(true);
    });
  });
});
