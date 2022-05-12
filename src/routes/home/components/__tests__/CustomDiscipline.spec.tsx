import { RenderAPI } from '@testing-library/react-native'
import React from 'react'

import { Discipline, ForbiddenError, NetworkError } from '../../../../constants/endpoints'
import labels from '../../../../constants/labels.json'
import createNavigationMock from '../../../../testing/createNavigationPropMock'
import {
  mockUseLoadAsyncLoading,
  mockUseLoadAsyncWithData,
  mockUseLoadAsyncWithError
} from '../../../../testing/mockUseLoadFromEndpoint'
import render from '../../../../testing/render'
import CustomDiscipline from '../CustomDiscipline'

describe('CustomDisciplineItem', () => {
  const navigation = createNavigationMock<'Home'>()
  const mockData: Discipline = {
    id: 1,
    title: 'Custom Discipline',
    description: 'description',
    icon: 'none',
    numberOfChildren: 1,
    parentTitle: null,
    needsTrainingSetEndpoint: false,
    isLeaf: false,
    apiKey: 'abc',
    leafDisciplines: []
  }

  const renderCustomDisciplineItem = (): RenderAPI =>
    render(<CustomDiscipline apiKey='abc' navigation={navigation} refresh={() => undefined} />)

  it('should display data', () => {
    mockUseLoadAsyncWithData(mockData)
    const { getByText } = renderCustomDisciplineItem()
    expect(getByText('Custom Discipline')).toBeDefined()
    expect(getByText(labels.general.discipline)).toBeDefined()
  })

  it('should display loading', () => {
    mockUseLoadAsyncLoading()
    const { getByTestId } = renderCustomDisciplineItem()
    expect(getByTestId('loading')).toBeDefined()
  })

  it('should display no internet error', () => {
    mockUseLoadAsyncWithError(NetworkError)
    const { getByText } = renderCustomDisciplineItem()
    expect(getByText(`${labels.general.error.noWifi} (${NetworkError})`)).toBeDefined()
  })

  it('should display forbidden error', () => {
    mockUseLoadAsyncWithError(ForbiddenError)
    const { getByText } = renderCustomDisciplineItem()
    expect(getByText(`${labels.home.errorLoadCustomDiscipline} abc`)).toBeDefined()
  })
})
