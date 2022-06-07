import { RenderAPI } from '@testing-library/react-native'
import React from 'react'

import { ForbiddenError, NetworkError } from '../../../../constants/endpoints'
import labels from '../../../../constants/labels.json'
import { mockDisciplines } from '../../../../testing/mockDiscipline'
import {
  mockUseLoadAsyncLoading,
  mockUseLoadAsyncWithData,
  mockUseLoadAsyncWithError
} from '../../../../testing/mockUseLoadFromEndpoint'
import render from '../../../../testing/render'
import DisciplineCard from '../DisciplineCard'

jest.mock('@react-navigation/native')
jest.useFakeTimers()

const navigateToDiscipline = jest.fn()

describe('DisciplineCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderDisciplineCard = (): RenderAPI =>
    render(<DisciplineCard identifier={{ disciplineId: 1 }} navigateToDiscipline={navigateToDiscipline} />)

  it('should show discipline card', async () => {
    mockUseLoadAsyncWithData(mockDisciplines()[0])
    const { getByText, findByText } = renderDisciplineCard()
    expect(getByText(mockDisciplines()[0].title)).toBeDefined()
    await expect(findByText(labels.home.continue)).toBeDefined()
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

  it('should display forbidden error', async () => {
    mockUseLoadAsyncWithError(ForbiddenError)
    const { getByText } = render(
      <DisciplineCard identifier={{ apiKey: 'abc' }} navigateToDiscipline={navigateToDiscipline} />
    )
    expect(getByText(`${labels.home.errorLoadCustomDiscipline} abc`)).toBeDefined()
    expect(getByText(labels.home.deleteModal.confirm)).toBeDefined()
  })
})
