import { shallow } from 'enzyme'
import React from 'react'
import 'react-native'

import App from '../../App'

describe('App', () => {
  it('renders correctly', () => {
    shallow(<App />)
  })
})
