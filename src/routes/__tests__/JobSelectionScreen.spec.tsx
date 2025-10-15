import { RouteProp } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { COLORS } from '../../constants/theme/colors'
import { useLoadDisciplines } from '../../hooks/useLoadDisciplines'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { StorageCache } from '../../services/Storage'
import { getLabels } from '../../services/helpers'
import createNavigationMock from '../../testing/createNavigationPropMock'
import { getReturnOf } from '../../testing/helper'
import { mockDisciplines } from '../../testing/mockDiscipline'
import { renderWithStorageCache } from '../../testing/render'
import JobSelectionScreen from '../JobSelectionScreen'

jest.mock('@react-navigation/native')
jest.mock('../../hooks/useLoadDisciplines')

describe('JobSelectionScreen', () => {
  const navigation = createNavigationMock<'JobSelection'>()
  const getRoute = (initialSelection: boolean): RouteProp<RoutesParams, 'JobSelection'> => ({
    key: 'key-1',
    name: 'JobSelection',
    params: {
      initialSelection,
      discipline: mockDisciplines()[1],
    },
  })

  const storageCache = StorageCache.createDummy()
  const renderScreen = (initialSelection = true) =>
    renderWithStorageCache(
      storageCache,
      <JobSelectionScreen route={getRoute(initialSelection)} navigation={navigation} />,
    )

  beforeEach(async () => {
    await storageCache.setItem('selectedJobs', null)
  })

  it('should select jobs when pressed', async () => {
    await storageCache.setItem('selectedJobs', [])
    mocked(useLoadDisciplines).mockReturnValue(getReturnOf(mockDisciplines()))

    const { findByText, queryAllByTestId } = renderScreen()
    expect(await findByText(getLabels().scopeSelection.skipSelection)).toBeDefined()
    const job = await findByText(mockDisciplines()[0].title)
    expect(job).toBeDefined()
    expect(queryAllByTestId('check-icon')).toHaveLength(0)
    fireEvent.press(job)
    await waitFor(async () => {
      const selectedJobs = storageCache.getItem('selectedJobs')
      expect(selectedJobs).toEqual([mockDisciplines()[0].id])
    })
  })

  it('should unselect job when pressed', async () => {
    await storageCache.setItem('selectedJobs', [mockDisciplines()[0].id])

    mocked(useLoadDisciplines).mockReturnValue(getReturnOf(mockDisciplines()))
    await storageCache.setItem('selectedJobs', [mockDisciplines()[0].id])

    const { findByText, queryAllByTestId } = renderScreen()
    expect(await findByText(getLabels().scopeSelection.confirmSelection)).toBeDefined()
    const job = await findByText(mockDisciplines()[0].title)
    expect(job).toBeDefined()
    expect(queryAllByTestId('check-icon')).toHaveLength(1)
    fireEvent.press(job)

    await waitFor(async () => {
      const selectedJobs = storageCache.getItem('selectedJobs')
      expect(selectedJobs).toEqual([])
    })
  })

  it('should disable selection when not initial view', async () => {
    await storageCache.setItem('selectedJobs', [mockDisciplines()[0].id])

    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))

    const { findAllByTestId } = renderScreen(false)
    const jobs = await findAllByTestId('list-item')
    expect(jobs[0]).toHaveStyle({ backgroundColor: COLORS.disabled })
  })

  it('should navigate on selection when not initial view', async () => {
    mocked(useLoadDisciplines).mockReturnValue(getReturnOf(mockDisciplines()))

    const { findByText } = renderScreen(false)
    const job = await findByText(mockDisciplines()[0].title)
    fireEvent.press(job)
    await waitFor(() => expect(navigation.navigate).toHaveBeenCalledWith('ManageSelection'))
  })
})
