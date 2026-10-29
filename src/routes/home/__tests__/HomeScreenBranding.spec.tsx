import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import theme from '../../../constants/theme'
import { SelectedJob } from '../../../models/Job'
import { getJob, getUnitsOfJob, getWordsByUnit } from '../../../services/CmsApi'
import { StorageCache } from '../../../services/Storage'
import { getLabels } from '../../../services/helpers'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { mockTelcArea } from '../../../testing/mockContentArea'
import { mockJobs } from '../../../testing/mockJob'
import { renderWithStorageCache } from '../../../testing/render'
import HomeScreen from '../HomeScreen'

jest.mock('@react-navigation/native')
jest.mock('../../../services/CmsApi')

describe('HomeScreen branding', () => {
  const navigation = createNavigationMock<'Home'>()
  const [telcJob, lunesJob] = mockJobs()
  const telc = mockTelcArea()

  let storageCache: StorageCache

  const renderHome = async (selectedJobs: SelectedJob[], firstJobName: string, contentArea = telc) => {
    await storageCache.setItem('contentAreas', [contentArea])
    await storageCache.setItem('selectedJobs', selectedJobs)
    const result = renderWithStorageCache(storageCache, <HomeScreen navigation={navigation} />)
    await waitFor(() => expect(result.getByText(firstJobName)).toBeDefined())
    return result
  }

  beforeEach(() => {
    storageCache = StorageCache.createDummy()
    mocked(getJob).mockImplementation(async ({ id }) =>
      id.type === 'standard' && id.id === lunesJob!.id.id ? lunesJob! : telcJob!,
    )
    mocked(getUnitsOfJob).mockResolvedValue([])
    mocked(getWordsByUnit).mockResolvedValue([])
  })

  it('should show telc colors and logos for a telc job', async () => {
    const { getByTestId, getByText } = await renderHome([{ id: telcJob!.id.id, token: telc.token }], telcJob!.name)

    expect(getByText('Willkommen im telc-Bereich')).toBeDefined()
    expect(getByTestId('header')).toHaveStyle({ backgroundColor: '#a01915' })
    expect(getByTestId('main-logo')).toBeTruthy()
    expect(getByTestId('secondary-logo')).toBeTruthy()
    expect(getByTestId('start-learning-button')).toHaveStyle({ backgroundColor: '#007dbe' })
    expect(getByTestId('start-training-button')).toHaveStyle({ backgroundColor: '#027b91' })
    expect(getByTestId('learning-progress-bar')).toHaveStyle({ backgroundColor: '#007dbe' })
    expect(getByText(telcJob!.name)).toBeDefined()
  })

  it('should leave the Lunes look for a public job', async () => {
    const { getByTestId, getByText, queryByText, queryByTestId } = await renderHome(
      [{ id: lunesJob!.id.id }],
      lunesJob!.name,
    )

    expect(getByText('Willkommen bei Lunes!')).toBeDefined()
    expect(queryByText('Willkommen im telc-Bereich')).toBeNull()
    expect(getByTestId('header')).toHaveStyle({ backgroundColor: theme.colors.backgroundHeader })
    expect(queryByTestId('main-logo')).toBeNull()
    expect(queryByTestId('secondary-logo')).toBeNull()
    expect(getByTestId('start-learning-button')).toHaveStyle({ backgroundColor: theme.colors.backgroundLearning })
    expect(getByTestId('start-training-button')).toHaveStyle({ backgroundColor: theme.colors.backgroundTraining })
    expect(getByTestId('learning-progress-bar')).toHaveStyle({ backgroundColor: '#5b7ada' })
  })

  it('should switch between telc and Lunes styling when changing the visible job', async () => {
    const { getByTestId, getByText, queryByTestId } = await renderHome(
      [{ id: telcJob!.id.id, token: telc.token }, { id: lunesJob!.id.id }],
      telcJob!.name,
    )
    expect(getByTestId('header')).toHaveStyle({ backgroundColor: '#a01915' })
    expect(getByText('Willkommen im telc-Bereich')).toBeDefined()

    fireEvent.press(getByTestId('navigate-right'))

    await waitFor(() => expect(getByTestId('header')).toHaveStyle({ backgroundColor: theme.colors.backgroundHeader }))
    expect(getByText('Willkommen bei Lunes!')).toBeDefined()
    expect(queryByTestId('secondary-logo')).toBeNull()

    fireEvent.press(getByTestId('navigate-left'))

    await waitFor(() => expect(getByTestId('header')).toHaveStyle({ backgroundColor: '#a01915' }))
    expect(getByText('Willkommen im telc-Bereich')).toBeDefined()
    expect(getByTestId('secondary-logo')).toBeTruthy()
  })

  it('should keep the light text on the telc colors', async () => {
    const { getByText, getAllByText } = await renderHome([{ id: telcJob!.id.id, token: telc.token }], telcJob!.name)

    expect(getByText(getLabels().home.learnVocabulary)).toHaveStyle({ color: theme.colors.textOnLearningCard })
    expect(getByText(getLabels().home.trainVocabulary)).toHaveStyle({ color: theme.colors.textOnTrainingCard })
    getAllByText(getLabels().home.startExercise).forEach(label =>
      expect(label).toHaveStyle({ color: theme.colors.textOnLearningCard }),
    )
  })

  it('should keep a light area color and show dark text on it', async () => {
    const light = { ...telc, primaryColor: '#ffff00', learningColor: '#f0f0f0', trainingColor: '#cccccc' }

    const { getByTestId, getByText, getAllByText } = await renderHome(
      [{ id: telcJob!.id.id, token: telc.token }],
      telcJob!.name,
      light,
    )

    expect(getByTestId('header')).toHaveStyle({ backgroundColor: '#ffff00' })
    expect(getByTestId('menu-icon-white')).toHaveStyle({ color: theme.colors.black })
    expect(getByTestId('start-learning-button')).toHaveStyle({ backgroundColor: '#f0f0f0' })
    expect(getByTestId('learning-progress-bar')).not.toHaveStyle({ backgroundColor: '#f0f0f0' })
    expect(getByTestId('start-training-button')).toHaveStyle({ backgroundColor: '#cccccc' })
    expect(getByText(getLabels().home.learnVocabulary)).toHaveStyle({ color: theme.colors.black })
    expect(getByText(getLabels().home.trainVocabulary)).toHaveStyle({ color: theme.colors.black })
    getAllByText(getLabels().home.startExercise).forEach(label =>
      expect(label).toHaveStyle({ color: theme.colors.black }),
    )
  })

  it('should keep the light text of Lunes on the Lunes cards', async () => {
    const { getByText, getByTestId } = await renderHome([{ id: lunesJob!.id.id }], lunesJob!.name)

    expect(getByText(getLabels().home.learnVocabulary)).toHaveStyle({ color: '#f9fafb' })
    expect(getByText(getLabels().home.trainVocabulary)).toHaveStyle({ color: '#f9fafb' })
    expect(getByTestId('menu-icon-white')).toHaveStyle({ color: '#ffffff' })
  })
})
