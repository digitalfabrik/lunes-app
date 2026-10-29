import { RouteProp } from '@react-navigation/native'
import { mocked } from 'jest-mock'
import React from 'react'

import theme from '../../../constants/theme'
import useLoadWordsByJob from '../../../hooks/useLoadWordsByJob'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { StorageCache } from '../../../services/Storage'
import { getLabels } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { getReturnOf } from '../../../testing/helper'
import { mockTelcArea } from '../../../testing/mockContentArea'
import { mockJobs } from '../../../testing/mockJob'
import renderWithTheme, { renderWithStorageCache } from '../../../testing/render'
import TrainingExerciseSelectionScreen from '../TrainingExerciseSelectionScreen'

jest.mock('../../../hooks/useLoadWordsByJob')

describe('TrainingExerciseSelectionScreen', () => {
  const job = mockJobs()[0]!
  const navigation = createNavigationMock<'TrainingExerciseSelection'>()
  const route: RouteProp<RoutesParams, 'TrainingExerciseSelection'> = {
    key: '',
    name: 'TrainingExerciseSelection',
    params: { job },
  }

  const vocabularyItems = new VocabularyItemBuilder(3).build()

  beforeEach(() => {
    jest.clearAllMocks()
    mocked(useLoadWordsByJob).mockReturnValue(getReturnOf(vocabularyItems))
  })

  it('should display all trainings', () => {
    const { getByText } = renderWithTheme(<TrainingExerciseSelectionScreen navigation={navigation} route={route} />)

    expect(getByText(getLabels().exercises.training.image.title)).toBeVisible()
    expect(getByText(getLabels().exercises.training.speech.title)).toBeVisible()
    expect(getByText(getLabels().exercises.training.sentence.title)).toBeVisible()
  })

  it('should disable Satzbausteine when no example sentences are available', () => {
    const { getByText } = renderWithTheme(<TrainingExerciseSelectionScreen navigation={navigation} route={route} />)

    expect(getByText(getLabels().exercises.training.sentence.title)).toBeDisabled()
  })

  it('should enable Satzbausteine when example sentences are available', () => {
    const itemsWithSentences = vocabularyItems.map((item, index) => ({
      ...item,
      exampleSentence: { sentence: `Beispielsatz ${index}`, audio: '' },
    }))
    mocked(useLoadWordsByJob).mockReturnValue(getReturnOf(itemsWithSentences))

    const { getByText } = renderWithTheme(<TrainingExerciseSelectionScreen navigation={navigation} route={route} />)

    expect(getByText(getLabels().exercises.training.sentence.title)).not.toBeDisabled()
  })

  describe('branding', () => {
    const telc = mockTelcArea()
    const telcRoute: RouteProp<RoutesParams, 'TrainingExerciseSelection'> = {
      ...route,
      params: { job: { ...job, token: telc.token } },
    }

    const renderWithTelc = async (screenRoute: RouteProp<RoutesParams, 'TrainingExerciseSelection'>) => {
      const storageCache = StorageCache.createDummy()
      await storageCache.setItem('contentAreas', [telc])
      return renderWithStorageCache(
        storageCache,
        <TrainingExerciseSelectionScreen navigation={navigation} route={screenRoute} />,
      )
    }

    it('should show light text on the telc training color', async () => {
      const { getByText } = await renderWithTelc(telcRoute)

      expect(getByText(getLabels().exercises.training.image.title)).toHaveStyle({ color: theme.colors.background })
    })

    it('should keep the dark text of Lunes for a public job', async () => {
      const { getByText } = await renderWithTelc(route)

      expect(getByText(getLabels().exercises.training.image.title)).toHaveStyle({
        color: theme.colors.textOnTrainingItem,
      })
    })
  })
})
