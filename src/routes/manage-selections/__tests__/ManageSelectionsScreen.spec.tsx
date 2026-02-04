import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { getJob } from '../../../services/CmsApi'
import { StorageCache } from '../../../services/Storage'
import { getLabels } from '../../../services/helpers'
import { pushSelectedJob } from '../../../services/storageUtils'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { mockJobs } from '../../../testing/mockJob'
import { renderWithStorageCache } from '../../../testing/render'
import ManageSelectionsScreen from '../ManageSelectionsScreen'

jest.mock('@react-navigation/native')
jest.mock('../../../services/CmsApi')

describe('ManageSelectionsScreen', () => {
  const navigation = createNavigationMock<'ManageSelection'>()
  let storageCache: StorageCache
  const renderScreen = () => renderWithStorageCache(storageCache, <ManageSelectionsScreen navigation={navigation} />)

  beforeEach(async () => {
    storageCache = StorageCache.createDummy()
  })

  it('should show and delete selected jobs', async () => {
    await pushSelectedJob(storageCache, mockJobs()[0].id, mockJobs()[0].migrated)
    await storageCache.setItem('selectedJobs', [mockJobs()[0].id.id])
    mocked(getJob).mockReturnValueOnce(Promise.resolve(mockJobs()[0]))

    const { getByText, getByTestId } = renderScreen()
    await waitFor(() => expect(getByText(mockJobs()[0].name)).toBeDefined())
    const deleteIcon = getByTestId('delete-icon')
    fireEvent.press(deleteIcon)
    const confirmButton = getByText(getLabels().manageJobs.deleteModal.confirm)
    fireEvent.press(confirmButton)
    await waitFor(async () => {
      const selectedJobs = storageCache.getItem('selectedJobs')
      expect(selectedJobs).toEqual([])
    })
  })

  it('should navigate to select another job', () => {
    const { getByText } = renderScreen()
    const addJobText = getByText(getLabels().manageJobs.addJob)
    fireEvent.press(addJobText)
    expect(navigation.navigate).toHaveBeenCalledWith('JobSelection', { initialSelection: false })
  })
})
