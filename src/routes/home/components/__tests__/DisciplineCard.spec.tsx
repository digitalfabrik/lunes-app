import { RenderAPI } from '@testing-library/react-native'
import React from 'react'

import { ForbiddenError, NetworkError } from '../../../../constants/endpoints'
import labels from '../../../../constants/labels.json'
import { mockDisciplines } from '../../../../testing/mockDiscipline'
import {
  mockUseLoadAsyncLoading,
  mockUseLoadAsyncWithData,
  mockUseLoadAsyncWithError,
} from '../../../../testing/mockUseLoadFromEndpoint'
import render from '../../../../testing/render'
import DisciplineCard from '../DisciplineCard'

jest.mock('@react-navigation/native')

jest.mock('../../../../components/FeedbackModal', () => {
  const Text = require('react-native').Text
  return () => <Text>FeedbackModal</Text>
})

const navigateToDiscipline = jest.fn()

describe('DisciplineCard', () => {
  const renderDisciplineCard = (): RenderAPI =>
    render(<DisciplineCard identifier={{ disciplineId: 1, apiKey: '1' }} navigateToDiscipline={navigateToDiscipline} />)

  it('should show discipline card', async () => {
    mockUseLoadAsyncWithData(mockDisciplines()[0])
    const { getByText, findByText } = renderDisciplineCard()
    expect(getByText(mockDisciplines()[0].title)).toBeDefined()
    const element = await findByText(labels.home.start)
    expect(element).toBeDefined()
  })

  it('should display loading', () => {
    mockUseLoadAsyncLoading()
    const { getByTestId } = renderDisciplineCard()
    expect(getByTestId('loading')).toBeDefined()
  })

  it('should display no internet error', () => {
    mockUseLoadAsyncWithError(NetworkError)
    const { getByText } = renderDisciplineCard()
    expect(getByText(`${labels.general.error.noWifi} (${NetworkError})`)).toBeDefined()
  })

  it('should show delete button on forbidden error', () => {
    mockUseLoadAsyncWithError(ForbiddenError)
    const { getByText, getByTestId } = renderDisciplineCard()
    expect(getByText(`${labels.home.errorLoadCustomDiscipline} 1`)).toBeDefined()
    expect(getByTestId('delete-button')).toBeDefined()
  })

  it('should show delete button on unknown error', () => {
    mockUseLoadAsyncWithError('UnknownError')
    const { getByText, getByTestId } = renderDisciplineCard()
    expect(getByText(labels.general.error.unknown)).toBeDefined()
    expect(getByTestId('delete-button')).toBeDefined()
  })
})
