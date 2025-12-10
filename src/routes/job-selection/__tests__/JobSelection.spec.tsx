import { RouteProp } from '@react-navigation/native'
import { fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { RoutesParams } from '../../../navigation/NavigationTypes'
import { getJobs } from '../../../services/CmsApi'
import { StorageCache } from '../../../services/Storage'
import { getLabels } from '../../../services/helpers'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { mockJobs } from '../../../testing/mockJob'
import { renderWithStorageCache } from '../../../testing/render'
import ScopeSelection from '../JobSelectionScreen'

jest.mock('@react-navigation/native')
jest.mock('../../../services/CmsApi')

describe('JobSelection', () => {
  const navigation = createNavigationMock<'JobSelection'>()
  const getRoute = (initialSelection = true): RouteProp<RoutesParams, 'JobSelection'> => ({
    key: '',
    name: 'JobSelection',
    params: {
      initialSelection,
    },
  })

  const storageCache = StorageCache.createDummy()

  beforeEach(async () => {
    await storageCache.setItem('selectedJobs', null)
  })

  it('should skip selection', async () => {
    const { getByText } = renderWithStorageCache(
      storageCache,
      <ScopeSelection navigation={navigation} route={getRoute()} />,
    )
    const button = getByText(getLabels().scopeSelection.skipSelection)
    fireEvent.press(button)

    await waitFor(() => {
      expect(navigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'BottomTabNavigator' }],
      })
    })
  })

  it('should confirm selection', async () => {
    await storageCache.setItem('selectedJobs', [mockJobs()[0].id.id])
    const { getByText } = renderWithStorageCache(
      storageCache,
      <ScopeSelection navigation={navigation} route={getRoute()} />,
    )
    const button = getByText(getLabels().scopeSelection.confirmSelection)
    fireEvent.press(button)

    expect(navigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'BottomTabNavigator' }],
    })
  })

  it('should hide welcome message and buttons for non initial view', async () => {
    await storageCache.setItem('selectedJobs', [mockJobs()[0].id.id])
    const { queryByText } = renderWithStorageCache(
      storageCache,
      <ScopeSelection navigation={navigation} route={getRoute(false)} />,
    )
    expect(queryByText(getLabels().scopeSelection.welcome)).toBeNull()
    expect(queryByText(getLabels().scopeSelection.skipSelection)).toBeNull()
    expect(queryByText(getLabels().scopeSelection.confirmSelection)).toBeNull()
  })

  it('should select job', async () => {
    mocked(getJobs).mockReturnValueOnce(Promise.resolve(mockJobs()))
    const { getByText } = renderWithStorageCache(
      storageCache,
      <ScopeSelection navigation={navigation} route={getRoute(false)} />,
    )

    expect(storageCache.getItem('selectedJobs')).toBeNull()

    const button = await waitFor(() => getByText(mockJobs()[0].name))
    fireEvent.press(button)

    expect(storageCache.getItem('selectedJobs')).toEqual([mockJobs()[0].id.id])
  })

  it('should unselect job on initial selection', async () => {
    mocked(getJobs).mockReturnValueOnce(Promise.resolve(mockJobs()))
    await storageCache.setItem('selectedJobs', [mockJobs()[0].id.id])
    const { queryAllByTestId, getAllByTestId } = renderWithStorageCache(
      storageCache,
      <ScopeSelection navigation={navigation} route={getRoute(true)} />,
    )

    await waitFor(() => expect(queryAllByTestId('check-icon')).toHaveLength(1))

    const button = queryAllByTestId('check-icon')[0]
    fireEvent.press(button)

    await waitForElementToBeRemoved(() => getAllByTestId('check-icon'))
    await waitFor(() => expect(storageCache.getItem('selectedJobs')).toEqual([]))
  })

  it('should disable button if not on initial selection', async () => {
    mocked(getJobs).mockReturnValueOnce(Promise.resolve(mockJobs()))
    await storageCache.setItem('selectedJobs', [mockJobs()[0].id.id])
    const { getByText } = renderWithStorageCache(
      storageCache,
      <ScopeSelection navigation={navigation} route={getRoute(false)} />,
    )

    const button = await waitFor(() => getByText(mockJobs()[0].name))
    expect(button).toBeDisabled()

    const secondJob = getByText(mockJobs()[1].name)
    expect(secondJob).not.toBeDisabled()
  })
})
