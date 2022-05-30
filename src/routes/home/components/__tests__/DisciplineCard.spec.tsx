import { NavigationContainer } from '@react-navigation/native'
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

jest.useFakeTimers()

describe('DisciplineCard', () => {
  const renderDisciplineCard = (): RenderAPI =>
    render(
      <NavigationContainer>
        <DisciplineCard identifier={{ disciplineId: 1 }} />
      </NavigationContainer>
    )

  it('should show discipline card', async () => {
    mockUseLoadAsyncWithData(mockDisciplines()[0])
    const { getByText, findByText, getByTestId } = renderDisciplineCard()
    expect(getByText(mockDisciplines()[0].title)).toBeDefined()
    expect(getByTestId('progress-circle')).toBeDefined()
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
      <NavigationContainer>
        <DisciplineCard identifier={{ apiKey: 'abc' }} />
      </NavigationContainer>
    )
    expect(getByText(`${labels.home.errorLoadCustomDiscipline} abc`)).toBeDefined()
    expect(getByText(labels.home.deleteModal.confirm)).toBeDefined()
  })
})
