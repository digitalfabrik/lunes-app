import 'react-native';
import React from 'react';
import Button from '../../components/Button';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {styles} from '../../components/Button';
import {Text} from 'react-native';
import {BUTTONS_THEME} from '../../constants/data';
import {IButtonProps} from '../../interfaces/index';

describe('Components', () => {
  describe('Button', () => {
    const defaultButtonProps: IButtonProps = {
      children: <Text>Button children</Text>,
      onPress: () => {},
      disabled: false,
      theme: '',
    };

    it('should render without issues', () => {
      const component = shallow(<Button {...defaultButtonProps} />);
      expect(toJson(component)).toMatchSnapshot();
    });

    it('should call onPress event', () => {
      const buttonProps: IButtonProps = {
        ...defaultButtonProps,
        onPress: jest.fn(() => result),
      };
      const result = 'I was Pressed';

      const component = shallow(<Button {...buttonProps} />);
      expect(buttonProps.onPress).not.toHaveBeenCalled();
      component.props().onPress();
      expect((buttonProps.onPress as jest.Mock).mock.calls.length).toBe(1);
      expect(component.props().onPress()).toBe(result);
    });

    it('should have disabled style when disabled is true', () => {
      const buttonProps: IButtonProps = {
        ...defaultButtonProps,
        disabled: true,
      };
      const style = [[styles.darkButton, styles.disabledButton], false];

      const component = shallow(<Button {...buttonProps} />);
      expect(component.props().style).toStrictEqual(style);
    });

    it('should not have disabled style when disabled is false', () => {
      const buttonProps: IButtonProps = {
        ...defaultButtonProps,
      };
      const style = [styles.button, false];

      const component = shallow(<Button {...buttonProps} />);
      expect(component.props().style).toStrictEqual(style);
    });

    it('should have dark style when theme is dark', () => {
      const buttonProps: IButtonProps = {
        ...defaultButtonProps,
        theme: BUTTONS_THEME.dark,
      };
      const style = [styles.darkButton, false];

      const component = shallow(<Button {...buttonProps} />);
      expect(component.props().style).toStrictEqual(style);
    });

    it('should have light style when theme is light', () => {
      const buttonProps: IButtonProps = {
        ...defaultButtonProps,
        theme: BUTTONS_THEME.light,
      };
      const style = [styles.lightButton, false];

      const component = shallow(<Button {...buttonProps} />);
      expect(component.props().style).toStrictEqual(style);
    });

    it('should render children passed to it', () => {
      const buttonProps: IButtonProps = {
        ...defaultButtonProps,
      };

      const component = shallow(<Button {...buttonProps} />);
      expect(component.contains(buttonProps.children)).toBe(true);
    });
  });
});
