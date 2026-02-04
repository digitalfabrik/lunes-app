import { RouteProp } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { StandardJob } from '../../models/Job'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getUnitsOfJob } from '../../services/CmsApi'
import { StorageCache } from '../../services/Storage'
import createNavigationMock from '../../testing/createNavigationPropMock'
import mockUnits from '../../testing/mockUnit'
import { renderWithStorageCache } from '../../testing/render'
import UnitSelectionScreen from '../UnitSelectionScreen'

jest.mock('@react-navigation/native')
jest.mock('../../services/CmsApi')

describe('UnitSelectionScreen', () => {
  const navigation = createNavigationMock<'UnitSelection'>()
  let storageCache: StorageCache

  const renderScreen = (overrides?: Partial<StandardJob>) => {
    const job: StandardJob = {
      id: { id: 42, type: 'standard' },
      name: 'Job',
      icon: null,
      numberOfUnits: 1,
      migrated: true,
      ...overrides,
    }
    const route: RouteProp<RoutesParams, 'UnitSelection'> = {
      key: 'key-1',
      name: 'UnitSelection',
      params: { job },
    }
    return renderWithStorageCache(storageCache, <UnitSelectionScreen route={route} navigation={navigation} />)
  }

  beforeEach(() => {
    storageCache = StorageCache.createDummy()
    mocked(getUnitsOfJob).mockReturnValue(Promise.resolve(mockUnits))
  })

  it('should display the correct title', async () => {
    const { getByText } = renderScreen()
    const title = await waitFor(() => getByText(mockUnits[0].title))
    expect(title).toBeDefined()
  })

  it('should display all units', async () => {
    const { getByText } = renderScreen()

    const firstUnit = await waitFor(() => getByText(mockUnits[0].title))
    const secondUnit = getByText(mockUnits[1].title)
    const thirdUnit = getByText(mockUnits[2].title)
    expect(firstUnit).toBeDefined()
    expect(secondUnit).toBeDefined()
    expect(thirdUnit).toBeDefined()
  })

  it('should navigate to exercises when list item pressed', async () => {
    const { getByText } = renderScreen()
    const unit = await waitFor(() => getByText(mockUnits[2].title))
    fireEvent.press(unit)

    expect(navigation.navigate).toHaveBeenCalledWith('StandardExercises', expect.anything())
  })

  describe('ProgressHint', () => {
    it('should show ProgressHint if the job was started before migration and is now migrated', async () => {
      await storageCache.setItem('notMigratedSelectedJobs', [42])

      const { getByText } = renderScreen()

      await waitFor(() => {
        expect(getByText('Mehr Infos hier')).toBeDefined()
      })
    })

    it('should not show ProgressHint if the job is not in notMigratedSelectedJobs', async () => {
      await storageCache.setItem('notMigratedSelectedJobs', [99])

      const { queryByText } = renderScreen()

      expect(queryByText('Mehr Infos hier')).toBeNull()
    })

    it('should not show ProgressHint if the job is in notMigratedSelectedJobs but not yet migrated', async () => {
      await storageCache.setItem('notMigratedSelectedJobs', [42])

      const { queryByText } = renderScreen({ migrated: false })

      expect(queryByText('Mehr Infos hier')).toBeNull()
    })

    it('should not show ProgressHint if notMigratedSelectedJobs is empty', async () => {
      await storageCache.setItem('notMigratedSelectedJobs', [])

      const { queryByText } = renderScreen()

      expect(queryByText('Mehr Infos hier')).toBeNull()
    })
  })
})
