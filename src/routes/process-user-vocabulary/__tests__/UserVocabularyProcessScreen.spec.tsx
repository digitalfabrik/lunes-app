import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { getLabels } from '../../../services/helpers'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import render from '../../../testing/render'
import UserVocabularyProcessScreen from '../UserVocabularyProcessScreen'

jest.mock('react-native-permissions', () => require('react-native-permissions/mock'))

describe('UserVocabularyProcessScreen', () => {
  const navigation = createNavigationMock<'UserVocabularyProcess'>()

  it('should view and delete thumbnail', async () => {
    const setState = jest.fn()
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [['image'], setState])

    const { getByText, getByTestId } = render(<UserVocabularyProcessScreen navigation={navigation} />)
    const deleteThumbnail = getByTestId('delete-on-thumbnail')
    expect(getByText(getLabels().userVocabulary.creation.addImage)).not.toBeDisabled()
    fireEvent.press(deleteThumbnail)
    expect(setState).toHaveBeenCalled() // TODO vielleicht noch verbessern
  })

  it('should disable image button, if already three images selected', () => {
    const setState = jest.fn()
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [['image-1', 'image-2', 'image-3'], setState])

    const { getAllByTestId, getByText } = render(<UserVocabularyProcessScreen navigation={navigation} />)
    const a = getAllByTestId('delete-on-thumbnail')
    expect(a).toHaveLength(3)
    expect(getByText(getLabels().userVocabulary.creation.addImage)).toBeDisabled()
  })

  it('should be able to add a recording', async () => {
    const { findByTestId, getByText } = render(<UserVocabularyProcessScreen navigation={navigation} />)
    const addAudioButton = getByText(getLabels().userVocabulary.creation.addAudio)
    expect(addAudioButton).not.toBeNull()
    fireEvent.press(addAudioButton)
    const recordButton = await findByTestId('record-audio-button')
    expect(recordButton).toBeDefined()
  })
})
