import React from 'react';
import MenuItem from '../../components/MenuItem';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {IMenuItemProps} from '../../interfaces/menuItem';
import {styles} from '../../components/MenuItem/styles';
import {Text} from 'react-native';
import {COLORS} from '../../constants/colors';

describe('Components', () => {
  describe('MenuItem', () => {
    const defaultMenuItemProps: IMenuItemProps = {
      selected: false,
      icon: '',
      title: '',
      children: <Text>description</Text>,
      onPress: () => {},
    };

    it('renders correctly across screens', () => {
      const component = shallow(<MenuItem {...defaultMenuItemProps} />);
      expect(toJson(component)).toMatchSnapshot();
    });

    it('should call onPress event', () => {
      const menuItemProps: IMenuItemProps = {
        ...defaultMenuItemProps,
        onPress: jest.fn(() => result),
      };
      const result = 'I was Pressed';

      const component = shallow(<MenuItem {...menuItemProps} />);
      expect(menuItemProps.onPress).not.toHaveBeenCalled();
      component.children().props().onPress();
      expect((menuItemProps.onPress as jest.Mock).mock.calls.length).toBe(1);
      expect(component.children().props().onPress()).toBe(result);
    });

    it('should display title passed to it', () => {
      const menuItemProps: IMenuItemProps = {
        ...defaultMenuItemProps,
        title: 'Menu item title',
      };

      const component = shallow(<MenuItem {...menuItemProps} />);
      expect(component.find('[testID="title"]').props().children).toBe(
        menuItemProps.title,
      );
    });

    it('should display image passed to it', () => {
      const menuItemProps: IMenuItemProps = {
        ...defaultMenuItemProps,
        icon: 'https://lunes.tuerantuer.org/media/images/Winkelmesser.jpeg',
      };

      const component = shallow(<MenuItem {...menuItemProps} />);
      expect(component.find('Image').prop('source')).toHaveProperty(
        'uri',
        menuItemProps.icon,
      );
    });

    it('should apply selected style when selected is true', () => {
      const menuItemProps: IMenuItemProps = {
        ...defaultMenuItemProps,
        selected: true,
      };
      const containerStyle = styles.wrapper;
      const titleStyle = styles.clickedItemTitle;

      const component = shallow(<MenuItem {...menuItemProps} />);
      expect(component.props().style).toStrictEqual(containerStyle);
      expect(component.find('[testID="title"]').props().style).toStrictEqual(
        titleStyle,
      );
    });

    it('should render children passed to it', () => {
      const menuItemProps: IMenuItemProps = {
        ...defaultMenuItemProps,
      };

      const component = shallow(<MenuItem {...menuItemProps} />);
      expect(component.contains(menuItemProps.children)).toBe(true);
    });

    it('should render black arrow icon when selected is false', () => {
      const menuItemProps: IMenuItemProps = {
        ...defaultMenuItemProps,
      };

      const component = shallow(<MenuItem {...menuItemProps} />);
      expect(component.find('[testID="arrow"]').props().fill).toBe(
        COLORS.lunesBlack,
      );
    });

    it('should render red arrow icon when selected is true', () => {
      const menuItemProps: IMenuItemProps = {
        ...defaultMenuItemProps,
        selected: true,
      };

      const component = shallow(<MenuItem {...menuItemProps} />);
      expect(component.find('[testID="arrow"]').props().fill).toBe(
        COLORS.lunesRedLight,
      );
    });
  });
});
