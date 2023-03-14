import { RouteProp } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'
import { DocumentDirectoryPath } from 'react-native-fs'

import { ARTICLES, VOCABULARY_ITEM_TYPES } from '../../../constants/data'
import { VocabularyItem } from '../../../constants/endpoints'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { getUserVocabularyItems, setUserVocabularyItems } from '../../../services/AsyncStorage'
import { getLabels } from '../../../services/helpers'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import render from '../../../testing/render'
import UserVocabularyProcessScreen from '../UserVocabularyProcessScreen'

jest.mock('react-native-permissions', () => require('react-native-permissions/mock'))
jest.mock('react-native-fs', () => ({
  moveFile: jest.fn(),
}))
jest.mock('../components/AudioRecordOverlay', () => () => {
  const { Text } = require('react-native')
  return <Text>AudioRecorderOverlay</Text>
})
jest.mock('react-native-image-crop-picker', () => ({
  openPicker: jest.fn(),
}))

describe('UserVocabularyProcessScreen', () => {
  const navigation = createNavigationMock<'UserVocabularyProcess'>()
  const getRoute = (itemToEdit?: VocabularyItem): RouteProp<RoutesParams, 'UserVocabularyProcess'> => ({
    key: 'key1',
    name: 'UserVocabularyProcess',
    params: {
      headerBackLabel: 'back',
      itemToEdit,
    },
  })

  it('should view and delete thumbnail', async () => {
    const setState = jest.fn()
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [['image'], setState])

    const { getByText, getByTestId } = render(
      <UserVocabularyProcessScreen navigation={navigation} route={getRoute()} />
    )
    const deleteThumbnail = getByTestId('delete-on-thumbnail')
    expect(getByText(getLabels().userVocabulary.creation.addImage)).not.toBeDisabled()
    fireEvent.press(deleteThumbnail)
    expect(setState).toHaveBeenCalled()
  })

  it('should disable image button, if already three images selected', () => {
    const setState = jest.fn()
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [['image-1', 'image-2', 'image-3'], setState])

    const { getAllByTestId, getByText } = render(
      <UserVocabularyProcessScreen navigation={navigation} route={getRoute()} />
    )
    const a = getAllByTestId('delete-on-thumbnail')
    expect(a).toHaveLength(3)
    expect(getByText(getLabels().userVocabulary.creation.addImage)).toBeDisabled()
  })

  it('should be able to add a recording', async () => {
    const { findByText, getByText } = render(<UserVocabularyProcessScreen navigation={navigation} route={getRoute()} />)
    const addAudioButton = getByText(getLabels().userVocabulary.creation.addAudio)
    expect(addAudioButton).not.toBeNull()
    fireEvent.press(addAudioButton)
    const recordButton = await findByText('AudioRecorderOverlay')
    expect(recordButton).toBeDefined()
  })

  describe('edit vocabulary', () => {
    const itemToEdit = {
      id: 2,
      type: VOCABULARY_ITEM_TYPES.userCreated,
      word: 'Auto',
      article: ARTICLES[3],
      images: [
        { id: 0, image: `file:///${DocumentDirectoryPath}/image-2-0.jpg` },
        { id: 1, image: `file:///${DocumentDirectoryPath}/image-2-1.jpg` },
      ],
      audio: `file:///${DocumentDirectoryPath}/audio-2.m4a`,
      alternatives: [],
    }

    beforeEach(async () => setUserVocabularyItems([itemToEdit]))

    it('should fill all fields correctly', async () => {
      const { getByPlaceholderText, getByTestId, getAllByTestId } = render(
        <UserVocabularyProcessScreen navigation={navigation} route={getRoute(itemToEdit)} />
      )
      const textField = getByPlaceholderText(getLabels().userVocabulary.creation.wordPlaceholder)
      expect(textField.props.value).toEqual(itemToEdit.word)
      const images = getAllByTestId('delete-on-thumbnail')
      expect(images).toHaveLength(2)
      const audio = getByTestId('delete-audio-recording')
      expect(audio).toBeDefined()
    })

    it('should keep all fields except word if only word is updated', async () => {
      const { getByPlaceholderText, getByText } = render(
        <UserVocabularyProcessScreen navigation={navigation} route={getRoute(itemToEdit)} />
      )
      const textField = getByPlaceholderText(getLabels().userVocabulary.creation.wordPlaceholder)
      fireEvent.changeText(textField, 'new-word')
      const saveButton = getByText(getLabels().userVocabulary.creation.saveButton)
      fireEvent.press(saveButton)

      const shouldBe = { ...itemToEdit }
      shouldBe.word = 'new-word'
      await waitFor(async () => {
        const userVocabulary = await getUserVocabularyItems()
        expect(userVocabulary).toEqual([shouldBe])
      })
    })
  })
})
