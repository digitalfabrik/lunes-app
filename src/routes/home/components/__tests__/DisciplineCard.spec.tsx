import { RenderAPI } from '@testing-library/react-native'
import React from 'react'

import { NetworkError } from '../../../../constants/endpoints'
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

describe('DisciplineCard', () => {
  const navigate = jest.fn()
  const onPress = jest.fn()

  const renderDisciplineCard = (): RenderAPI =>
    render(
      <DisciplineCard disciplineId={mockDisciplines()[0].id} navigateToNextExercise={navigate} onPress={onPress} />
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
})
