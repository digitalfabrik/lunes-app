import { RenderAPI } from '@testing-library/react-native'
import React from 'react'

import { Discipline, ForbiddenError, NetworkError } from '../../../../constants/endpoints'
import labels from '../../../../constants/labels.json'
import { Return } from '../../../../hooks/useLoadAsync'
import { mockDisciplines } from '../../../../testing/mockDiscipline'
import render from '../../../../testing/render'
import SelectionItem from '../SelectionItem'

describe('SelectionItem', () => {
  const refresh = jest.fn()
  const renderSelectionItem = (discipline: Return<Discipline>): RenderAPI =>
    render(<SelectionItem discipline={discipline} deleteItem={() => jest.fn()} />)

  it('should display data', () => {
    const { getByText } = renderSelectionItem({
      data: mockDisciplines()[0],
      loading: false,
      error: null,
      refresh
    })
    expect(getByText(mockDisciplines()[0].title)).toBeDefined()
  })

  it('should display loading', () => {
    const { getByTestId } = renderSelectionItem({
      data: null,
      loading: true,
      error: null,
      refresh
    })
    expect(getByTestId('loading')).toBeDefined()
  })

  it('should display no internet error', () => {
    const { getByText } = renderSelectionItem({
      data: null,
      loading: false,
      error: new Error(NetworkError),
      refresh
    })
    expect(getByText(`${labels.general.error.noWifi} (${NetworkError})`)).toBeDefined()
  })

  it('should display forbidden error', () => {
    const { getByText } = renderSelectionItem({
      data: null,
      loading: false,
      error: new Error(ForbiddenError),
      refresh
    })
    expect(getByText(`${labels.home.errorLoadCustomDiscipline}`)).toBeDefined()
  })
})
