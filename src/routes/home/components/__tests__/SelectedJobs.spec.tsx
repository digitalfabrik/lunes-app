import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { getJob } from '../../../../services/CmsApi'
import { StorageCache } from '../../../../services/Storage'
import { getLabels } from '../../../../services/helpers'
import { mockJobs } from '../../../../testing/mockJob'
import render, { renderWithStorageCache } from '../../../../testing/render'
import SelectedJobs from '../SelectedJobs'

jest.mock('@react-navigation/native')
jest.mock('../../../../services/CmsApi')

describe('SelectedJobs', () => {
  const defaultProps = {
    navigateToJob: jest.fn(),
    navigateToTrainingExerciseSelection: jest.fn(),
    navigateToJobSelection: jest.fn(),
    navigateToManageSelection: jest.fn(),
  }

  it('should show empty state and navigate to job selection when no jobs', () => {
    const navigateToJobSelection = jest.fn()
    const { getByText, queryByTestId } = render(
      <SelectedJobs {...defaultProps} navigateToJobSelection={navigateToJobSelection} />,
    )
    expect(getByText(`${getLabels().home.jobs} [0]`)).toBeDefined()
    expect(queryByTestId('edit-professions-button')).toBeNull()
    expect(queryByTestId('add-profession-button')).toBeNull()
    expect(getByText(getLabels().home.emptyState.title)).toBeDefined()
    expect(getByText(getLabels().home.emptyState.subtitle)).toBeDefined()
    fireEvent.press(getByText(getLabels().manageJobs.addJob))
    expect(navigateToJobSelection).toHaveBeenCalled()
  })

  it('should show a single job card with edit and add icons', async () => {
    const storageCache = StorageCache.createDummy()
    await storageCache.setItem('selectedJobs', [mockJobs()[0].id.id])
    mocked(getJob).mockResolvedValue(mockJobs()[0])

    const { getByText, getByTestId } = renderWithStorageCache(storageCache, <SelectedJobs {...defaultProps} />)

    await waitFor(() => expect(getByText(mockJobs()[0].name)).toBeDefined())
    expect(getByTestId('edit-professions-button')).toBeDefined()
    expect(getByTestId('add-profession-button')).toBeDefined()
  })

  it('should navigate between multiple jobs using arrow buttons', async () => {
    const [firstJob, secondJob] = mockJobs()
    const storageCache = StorageCache.createDummy()
    await storageCache.setItem('selectedJobs', [firstJob.id.id, secondJob.id.id])
    mocked(getJob).mockImplementation(async jobId =>
      jobId.type === 'standard' && jobId.id === secondJob.id.id ? secondJob : firstJob,
    )

    const { getByText, getByTestId, queryByTestId } = renderWithStorageCache(
      storageCache,
      <SelectedJobs {...defaultProps} />,
    )

    await waitFor(() => expect(getByText(firstJob.name)).toBeDefined())
    expect(queryByTestId('navigate-left')).toBeNull()
    expect(getByTestId('navigate-right')).toBeDefined()

    fireEvent.press(getByTestId('navigate-right'))

    await waitFor(() => expect(getByText(secondJob.name)).toBeDefined())
    expect(getByTestId('navigate-left')).toBeDefined()
    expect(queryByTestId('navigate-right')).toBeNull()
  })
})
