import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { useLoadDiscipline } from '../../../hooks/useLoadDiscipline'
import { StorageCache } from '../../../services/Storage'
import { getLabels } from '../../../services/helpers'
import { pushSelectedJob } from '../../../services/storageUtils'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { getReturnOf } from '../../../testing/helper'
import { mockDisciplines } from '../../../testing/mockDiscipline'
import { renderWithStorageCache } from '../../../testing/render'
import ManageSelectionsScreen from '../ManageSelectionsScreen'

jest.mock('@react-navigation/native')
jest.mock('../../../hooks/useLoadDiscipline')

describe('ManageSelectionsScreen', () => {
  const navigation = createNavigationMock<'ManageSelection'>()
  let storageCache: StorageCache
  const renderScreen = () => renderWithStorageCache(storageCache, <ManageSelectionsScreen navigation={navigation} />)

  beforeEach(async () => {
    storageCache = StorageCache.createDummy()
  })

  it('should show and delete selected jobs', async () => {
    await pushSelectedJob(storageCache, mockDisciplines()[0].id)
    await storageCache.setItem('selectedJobs', [mockDisciplines()[0].id])
    mocked(useLoadDiscipline).mockReturnValue(getReturnOf(mockDisciplines()[0]))

    const { getByText, getByTestId } = renderScreen()
    expect(getByText(mockDisciplines()[0].title)).toBeDefined()
    const deleteIcon = getByTestId('delete-icon')
    fireEvent.press(deleteIcon)
    const confirmButton = getByText(getLabels().manageSelection.deleteModal.confirm)
    fireEvent.press(confirmButton)
    await waitFor(async () => {
      const selectedJobs = storageCache.getItem('selectedJobs')
      expect(selectedJobs).toEqual([])
    })
  })

  it('should navigate to select another job', () => {
    const { getByText } = renderScreen()
    const addJobText = getByText(getLabels().manageSelection.addJob)
    fireEvent.press(addJobText)
    expect(navigation.navigate).toHaveBeenCalledWith('JobSelection', { initialSelection: false })
  })
})
