import { RenderAPI } from '@testing-library/react-native'
import React from 'react'

import { ForbiddenError, NetworkError } from '../../../../constants/endpoints'
import labels from '../../../../constants/labels.json'
import { mockJobs } from '../../../../testing/mockJob'
import {
  mockUseLoadAsyncLoading,
  mockUseLoadAsyncWithData,
  mockUseLoadAsyncWithError,
} from '../../../../testing/mockUseLoadFromEndpoint'
import render from '../../../../testing/render'
import SelectionItem from '../SelectionItem'

describe('SelectionItem', () => {
  const deleteItem = jest.fn()
  const renderSelectionItem = (): RenderAPI =>
    render(<SelectionItem identifier={{ disciplineId: 1, apiKey: '1' }} deleteItem={deleteItem} />)

  it('should display data', () => {
    mockUseLoadAsyncWithData(mockJobs()[0])
    const { getByText, getByTestId } = renderSelectionItem()
    expect(getByText(mockJobs()[0].title)).toBeDefined()
    expect(getByTestId('delete-icon')).toBeDefined()
  })

  it('should display loading', () => {
    mockUseLoadAsyncLoading()
    const { getByTestId } = renderSelectionItem()
    expect(getByTestId('loading')).toBeDefined()
  })

  it('should display no internet error', () => {
    mockUseLoadAsyncWithError(NetworkError)
    const { getByText } = renderSelectionItem()
    expect(getByText(`${labels.general.error.noWifi} (${NetworkError})`)).toBeDefined()
  })

  it('should display forbidden error', () => {
    mockUseLoadAsyncWithError(ForbiddenError)
    const { getByText, getByTestId } = renderSelectionItem()
    expect(getByText(`${labels.home.errorLoadCustomDiscipline} 1`)).toBeDefined()
    expect(getByTestId('delete-icon')).toBeDefined()
  })

  it('should allow to delete on unknown error', () => {
    mockUseLoadAsyncWithError('UnknownError')
    const { getByText, getByTestId } = renderSelectionItem()
    expect(getByText(labels.general.error.unknown)).toBeDefined()
    expect(getByTestId('delete-icon')).toBeDefined()
  })
})
