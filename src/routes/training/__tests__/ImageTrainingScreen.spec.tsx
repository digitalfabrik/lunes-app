import { RouteProp } from '@react-navigation/native'
import { waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { RoutesParams } from '../../../navigation/NavigationTypes'
import { getWordsByJob } from '../../../services/CmsApi'
import { getLabels } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import renderWithTheme from '../../../testing/render'
import ImageTrainingScreen from '../ImageTrainingScreen'

jest.mock('../../../services/CmsApi')

jest.mock('../../../components/AudioPlayer', () => {
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})

describe('ImageTrainingScreen', () => {
  const vocabularyItems = new VocabularyItemBuilder(8).build()
  const navigation = createNavigationMock<'ImageTraining'>()
  const route: RouteProp<RoutesParams, 'ImageTraining'> = {
    key: '',
    name: 'ImageTraining',
    params: {
      job: {
        id: { type: 'standard', id: 0 },
        name: 'Test job',
        icon: 'icon',
        numberOfUnits: vocabularyItems.length,
      },
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render initially', async () => {
    mocked(getWordsByJob).mockReturnValue(Promise.resolve(vocabularyItems))
    const { getByText, getAllByTestId, getByTestId } = renderWithTheme(
      <ImageTrainingScreen navigation={navigation} route={route} />,
    )

    await waitFor(() => expect(getByText(getLabels().exercises.training.images.selectImage)).toBeVisible())
    expect(getAllByTestId('imageOption')).toHaveLength(4)

    const skipButton = getByTestId('button-skip')
    expect(skipButton).toBeVisible()
  })

  it('should immediately go back if there are no vocabulary items', async () => {
    mocked(getWordsByJob).mockReturnValue(Promise.resolve([]))
    renderWithTheme(<ImageTrainingScreen navigation={navigation} route={route} />)

    await waitFor(() => expect(navigation.goBack).toHaveBeenCalled())
  })
})
