import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Action from '../../components/Actions';

it('renders correctly across screens', () => {
  const tree = renderer.create(<Action />).toJSON();
  expect(tree).toMatchSnapshot();
});
