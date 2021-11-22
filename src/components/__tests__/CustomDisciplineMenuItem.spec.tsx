import { render, RenderAPI } from '@testing-library/react-native'
import React from 'react'

import labels from '../../constants/labels.json'
import createNavigationMock from '../../testing/createNavigationPropMock'
import {
  mockUseLoadAsyncLoading,
  mockUseLoadAsyncWithData,
  mockUseLoadAsyncWithError
} from '../../testing/mockUseLoadFromEndpoint'
import wrapWithTheme from '../../testing/wrapWithTheme'
import CustomDisciplineMenuItem from '../CustomDisciplineMenuItem'

describe('Components', () => {
  describe('CustomDisciplineMenuItem', () => {
    const navigation = createNavigationMock<'Home'>()
    const mockData = {
      id: 1,
      title: 'Custom Discipline',
      description: 'description',
      icon: 'none',
      numberOfChildren: 1,
      isLeaf: false,
      apiKey: 'abc'
    }

    const renderItem = (): RenderAPI => {
      return render(
        <CustomDisciplineMenuItem
          apiKey={'abc'}
          selectedId={'0'}
          setSelectedId={jest.fn()}
          navigation={navigation}
          refresh={jest.fn()}
        />,
        { wrapper: wrapWithTheme }
      )
    }

    it('should display data', () => {
      mockUseLoadAsyncWithData(mockData)
      const { getByText } = renderItem()
      expect(getByText('Custom Discipline')).toBeDefined()
      expect(getByText(`1 ${labels.home.unit}`)).toBeDefined()
    })

    it('should display loading', () => {
      mockUseLoadAsyncLoading()
      const { getByTestId } = renderItem()
      expect(getByTestId('loading')).toBeDefined()
    })

    it('should display error', () => {
      mockUseLoadAsyncWithError('Network Error')
      const { getByText } = renderItem()
      expect(getByText(`${labels.home.errorLoadCustomDiscipline} abc`)).toBeDefined()
    })

    // TODO: should delete from AsyncStorage when delete
  })
})
