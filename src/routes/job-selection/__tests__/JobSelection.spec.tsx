import { RouteProp } from '@react-navigation/native'
import { fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { COLORS } from '../../../constants/theme/colors'
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
  const getRoute = (
    initialSelection = true,
    jobScope?: RoutesParams['JobSelection']['jobScope'],
  ): RouteProp<RoutesParams, 'JobSelection'> => ({
    key: '',
    name: 'JobSelection',
    params: {
      initialSelection,
      jobScope,
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
        routes: [{ name: 'BottomTabNavigator', params: { screen: 'HomeTab', params: { screen: 'Home' } } }],
      })
    })
  })
  it('should confirm selection', async () => {
    mocked(getJobs).mockReturnValueOnce(Promise.resolve(mockJobs()))
    await storageCache.setItem('selectedJobs', [{ id: mockJobs()[0]!.id.id }])

    const { getByText } = renderWithStorageCache(
      storageCache,
      <ScopeSelection navigation={navigation} route={getRoute()} />,
    )

    await waitFor(() => {
      expect(getByText(mockJobs()[0]!.name)).toBeDefined()
    })

    const button = getByText(getLabels().scopeSelection.confirmSelection)
    fireEvent.press(button)

    await waitFor(() => {
      expect(navigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'BottomTabNavigator', params: { screen: 'HomeTab', params: { screen: 'Home' } } }],
      })
    })
  })
  it('should hide welcome message and buttons for non initial view', async () => {
    mocked(getJobs).mockReturnValueOnce(Promise.resolve(mockJobs()))
    await storageCache.setItem('selectedJobs', [{ id: mockJobs()[0]!.id.id }])

    const { queryByText, getByText } = renderWithStorageCache(
      storageCache,
      <ScopeSelection navigation={navigation} route={getRoute(false)} />,
    )

    await waitFor(() => {
      expect(getByText(mockJobs()[0]!.name)).toBeDefined()
    })

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

    const button = await waitFor(() => getByText(mockJobs()[0]!.name))
    fireEvent.press(button)

    await waitFor(() => {
      expect(storageCache.getItem('selectedJobs')).toEqual([{ id: mockJobs()[0]!.id.id }])
    })
  })

  it('should unselect job on initial selection', async () => {
    mocked(getJobs).mockReturnValueOnce(Promise.resolve(mockJobs()))
    await storageCache.setItem('selectedJobs', [{ id: mockJobs()[0]!.id.id }])
    const { queryAllByTestId, getAllByTestId } = renderWithStorageCache(
      storageCache,
      <ScopeSelection navigation={navigation} route={getRoute(true)} />,
    )

    await waitFor(() => expect(queryAllByTestId('check-icon')).toHaveLength(1))

    const button = queryAllByTestId('check-icon')[0]!
    fireEvent.press(button)

    await waitForElementToBeRemoved(() => getAllByTestId('check-icon'))
    await waitFor(() => expect(storageCache.getItem('selectedJobs')).toEqual([]))
  })

  it('should disable button if not on initial selection', async () => {
    mocked(getJobs).mockReturnValueOnce(Promise.resolve(mockJobs()))
    await storageCache.setItem('selectedJobs', [{ id: mockJobs()[0]!.id.id }])
    const { getByText } = renderWithStorageCache(
      storageCache,
      <ScopeSelection navigation={navigation} route={getRoute(false)} />,
    )

    const button = await waitFor(() => getByText(mockJobs()[0]!.name))
    expect(button).toBeDisabled()

    const secondJob = getByText(mockJobs()[1]!.name)
    expect(secondJob).not.toBeDisabled()
  })

  describe('content area scoping', () => {
    const telcJob = {
      id: { type: 'standard' as const, id: 101 },
      name: 'Telc Job',
      icon: 'none',
      numberOfUnits: 1,
      migrated: false,
      token: 'telc_token',
    }
    beforeEach(async () => {
      await storageCache.setItem('contentAreas', [{ id: 1, token: 'telc_token', name: 'telc' }])
      mocked(getJobs).mockImplementation(async token => (token === 'telc_token' ? [telcJob] : mockJobs()))
    })

    it('should show only the jobs of the given contentArea', async () => {
      const { getByText, queryByText } = renderWithStorageCache(
        storageCache,
        <ScopeSelection
          navigation={navigation}
          route={getRoute(false, { type: 'contentArea', token: 'telc_token' })}
        />,
      )

      await waitFor(() => expect(getByText(telcJob.name)).toBeDefined())
      expect(queryByText(mockJobs()[0]!.name)).toBeNull()
    })

    it('should show only the Lunes jobs without a contentArea token', async () => {
      const { getByText, queryByText } = renderWithStorageCache(
        storageCache,
        <ScopeSelection navigation={navigation} route={getRoute(false, { type: 'lunesOnly' })} />,
      )

      await waitFor(() => expect(getByText(mockJobs()[0]!.name)).toBeDefined())
      expect(queryByText(telcJob.name)).toBeNull()
    })

    it('should navigate to the Lunes-only job selection when the button is pressed', async () => {
      const { getByTestId } = renderWithStorageCache(
        storageCache,
        <ScopeSelection
          navigation={navigation}
          route={getRoute(false, { type: 'contentArea', token: 'telc_token' })}
        />,
      )

      const button = await waitFor(() => getByTestId('go-to-lunes-jobs-button'))
      fireEvent.press(button)

      expect(navigation.push).toHaveBeenCalledWith('JobSelection', {
        initialSelection: false,
        jobScope: { type: 'lunesOnly' },
      })
    })

    it('should give the Lunes-only link an accessibility label without the decorative arrow', async () => {
      const { getByTestId } = renderWithStorageCache(
        storageCache,
        <ScopeSelection
          navigation={navigation}
          route={getRoute(false, { type: 'contentArea', token: 'telc_token' })}
        />,
      )

      const button = await waitFor(() => getByTestId('go-to-lunes-jobs-button'))
      expect(button.props.accessibilityLabel).toBe('Alle Lunes-Berufe anzeigen')
    })

    it('should show a badge with the content area name only for jobs with a contentArea token', async () => {
      const { getAllByText } = renderWithStorageCache(
        storageCache,
        <ScopeSelection
          navigation={navigation}
          route={getRoute(false, { type: 'contentArea', token: 'telc_token' })}
        />,
      )

      await waitFor(() => expect(getAllByText('telc')).toHaveLength(1))
    })

    it('should tint the badge with the content area brand color when the CMS provides one, keeping the text dark for contrast', async () => {
      await storageCache.setItem('contentAreas', [
        { id: 1, token: 'telc_token', name: 'telc', primaryColor: '#123456' },
      ])
      const { getAllByText } = renderWithStorageCache(
        storageCache,
        <ScopeSelection
          navigation={navigation}
          route={getRoute(false, { type: 'contentArea', token: 'telc_token' })}
        />,
      )

      await waitFor(() =>
        expect(getAllByText('telc')[0]).toHaveStyle({
          color: COLORS.text,
          borderColor: '#123456',
          backgroundColor: '#1234561A',
        }),
      )
    })

    it('should fall back to a neutral badge color without a CMS brand color, rather than implying a specific brand', async () => {
      const { getAllByText } = renderWithStorageCache(
        storageCache,
        <ScopeSelection
          navigation={navigation}
          route={getRoute(false, { type: 'contentArea', token: 'telc_token' })}
        />,
      )

      await waitFor(() =>
        expect(getAllByText('telc')[0]).toHaveStyle({ color: COLORS.text, borderColor: COLORS.textSecondary }),
      )
    })

    it('should frame the job icon in the content area brand color, without the plain progress ring', async () => {
      await storageCache.setItem('contentAreas', [
        { id: 1, token: 'telc_token', name: 'telc', primaryColor: '#123456' },
      ])
      const { getByTestId, queryByTestId } = renderWithStorageCache(
        storageCache,
        <ScopeSelection
          navigation={navigation}
          route={getRoute(false, { type: 'contentArea', token: 'telc_token' })}
        />,
      )

      const frame = await waitFor(() => getByTestId('branded-icon-frame'))
      expect(frame).toHaveStyle({ borderColor: '#123456' })
      expect(queryByTestId('progress-circle')).toBeNull()
    })

    it('should not frame jobs without a contentArea token', async () => {
      const { getByText, queryByTestId } = renderWithStorageCache(
        storageCache,
        <ScopeSelection navigation={navigation} route={getRoute(false, { type: 'lunesOnly' })} />,
      )

      await waitFor(() => expect(getByText(mockJobs()[0]!.name)).toBeDefined())
      expect(queryByTestId('branded-icon-frame')).toBeNull()
    })

    it('should not show a confirm button before any job is selected', async () => {
      const { queryByText } = renderWithStorageCache(
        storageCache,
        <ScopeSelection
          navigation={navigation}
          route={getRoute(false, { type: 'contentArea', token: 'telc_token' })}
        />,
      )

      await waitFor(() => expect(queryByText(telcJob.name)).toBeDefined())
      expect(queryByText(getLabels().scopeSelection.confirmSelection)).toBeNull()
    })

    it('should not show a confirm button just because a job from a different scope is already selected', async () => {
      await storageCache.setItem('selectedJobs', [{ id: mockJobs()[0]!.id.id }])
      const { queryByText } = renderWithStorageCache(
        storageCache,
        <ScopeSelection
          navigation={navigation}
          route={getRoute(false, { type: 'contentArea', token: 'telc_token' })}
        />,
      )

      await waitFor(() => expect(queryByText(telcJob.name)).toBeDefined())
      expect(queryByText(getLabels().scopeSelection.confirmSelection)).toBeNull()
    })

    it('should show a confirm button that leads to the home screen once a job is selected', async () => {
      const { getByText } = renderWithStorageCache(
        storageCache,
        <ScopeSelection
          navigation={navigation}
          route={getRoute(false, { type: 'contentArea', token: 'telc_token' })}
        />,
      )

      const job = await waitFor(() => getByText(telcJob.name))
      fireEvent.press(job)

      const button = await waitFor(() => getByText(getLabels().scopeSelection.confirmSelection))
      fireEvent.press(button)

      expect(navigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'BottomTabNavigator', params: { screen: 'HomeTab', params: { screen: 'Home' } } }],
      })
    })

    it('should allow unselecting a job while choosing among a content area', async () => {
      await storageCache.setItem('selectedJobs', [{ id: telcJob.id.id, token: telcJob.token }])
      const { getByTestId } = renderWithStorageCache(
        storageCache,
        <ScopeSelection
          navigation={navigation}
          route={getRoute(false, { type: 'contentArea', token: 'telc_token' })}
        />,
      )

      const checkIcon = await waitFor(() => getByTestId('check-icon'))
      fireEvent.press(checkIcon)

      await waitFor(() => expect(storageCache.getItem('selectedJobs')).toEqual([]))
    })

    it('should show a heading naming the content area', async () => {
      const { getByText } = renderWithStorageCache(
        storageCache,
        <ScopeSelection
          navigation={navigation}
          route={getRoute(false, { type: 'contentArea', token: 'telc_token' })}
        />,
      )

      await waitFor(() =>
        expect(getByText(getLabels().scopeSelection.contentAreaTitle.replace('{}', 'telc'))).toBeDefined(),
      )
    })
  })
})
