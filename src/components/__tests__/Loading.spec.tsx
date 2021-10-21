import { render } from '@testing-library/react-native'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import React from 'react'
import { Text } from 'react-native'

import Loading, { ILoadingProps } from '../Loading'

describe('Components', () => {
  describe('Loading ', () => {
    const defaultLoadingProps: ILoadingProps = {
      isLoading: true,
      children: <Text>Test Children</Text>
    }

    it('should not render children when isLoading is true', () => {
      const loadingProps: ILoadingProps = {
        ...defaultLoadingProps
      }

      const { queryByText } = render(<Loading {...loadingProps} />)
      expect(queryByText('Test Children')).toBeNull()
    })

    it('should render children when isLoading is false', () => {
      const loadingProps: ILoadingProps = {
        ...defaultLoadingProps,
        isLoading: false
      }

      const { queryByText } = render(<Loading {...loadingProps} />)
      expect(queryByText('Test Children')).toBeDefined()
    })
  })
})
