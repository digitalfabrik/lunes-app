/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../../src/App';
import {shallow} from 'enzyme';

describe('App', () => {
  it('renders correctly', () => {
    shallow(<App />);
  });
});
