import { RouteProp } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'
import ReactNativeFS, { DocumentDirectoryPath } from 'react-native-fs'

import { ARTICLES } from '../../../constants/data'
import { UserVocabularyItem, VocabularyItemTypes } from '../../../models/VocabularyItem'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { StorageCache } from '../../../services/Storage'
import { getLabels } from '../../../services/helpers'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import render, { renderWithStorageCache } from '../../../testing/render'
import UserVocabularyProcessScreen from '../UserVocabularyProcessScreen'

jest.mock('react-native-permissions', () => require('react-native-permissions/mock'))
jest.mock('react-native-fs', () => ({
  moveFile: jest.fn(),
  unlink: jest.fn(),
}))
jest.mock('../components/AudioRecordOverlay', () => () => {
  const { Text } = require('react-native')
  return <Text>AudioRecorderOverlay</Text>
})
jest.mock('../../../components/AudioPlayer', () => () => {
  const { Text } = require('react-native')
  return <Text>AudioPlayer</Text>
})
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
}))
jest.mock('react-native-vision-camera', () => ({
  Camera: jest.fn(),
  useCameraDevice: jest.fn(),
}))

Date.now = jest.fn(() => 2000)

describe('UserVocabularyProcessScreen', () => {
  const itemToEdit: UserVocabularyItem = {
    id: { index: 2, type: VocabularyItemTypes.UserCreated },
    word: 'Auto',
    article: ARTICLES[3],
    images: [
      `file:///${DocumentDirectoryPath}/image-2-0-2000.jpg`,
      `file:///${DocumentDirectoryPath}/image-2-1-2000.jpg`,
    ],
    audio: `file:///${DocumentDirectoryPath}/audio-2.m4a`,
    alternatives: [],
  }
  const navigation = createNavigationMock<'UserVocabularyProcess'>()
  const getRoute = (itemToEdit?: UserVocabularyItem): RouteProp<RoutesParams, 'UserVocabularyProcess'> => ({
    key: 'key1',
    name: 'UserVocabularyProcess',
    params: {
      itemToEdit,
    },
  })

  let storageCache: StorageCache
  beforeEach(() => {
    storageCache = StorageCache.createDummy()
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should view and delete thumbnail', async () => {
    const { getByText, getByTestId, queryByTestId } = render(
      <UserVocabularyProcessScreen
        navigation={navigation}
        route={getRoute({ ...itemToEdit, images: [itemToEdit.images[0]] })}
      />,
    )
    const deleteThumbnail = getByTestId('delete-on-thumbnail')
    expect(getByText(getLabels().userVocabulary.creation.addImage)).not.toBeDisabled()
    fireEvent.press(deleteThumbnail)
    expect(queryByTestId('delete-on-thumbnail')).toBeFalsy()
  })

  it('should disable image button, if already three images selected', () => {
    const setState = jest.fn()
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [['image-1', 'image-2', 'image-3'], setState])

    const { getAllByTestId, getByText } = render(
      <UserVocabularyProcessScreen navigation={navigation} route={getRoute()} />,
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
    beforeEach(async () => storageCache.setItem('userVocabulary', [itemToEdit]))

    it('should fill all fields correctly', async () => {
      const { getByPlaceholderText, getByTestId, getAllByTestId } = renderWithStorageCache(
        storageCache,
        <UserVocabularyProcessScreen navigation={navigation} route={getRoute(itemToEdit)} />,
      )
      const textField = getByPlaceholderText(getLabels().userVocabulary.creation.wordPlaceholder)
      expect(textField.props.value).toEqual(itemToEdit.word)
      const images = getAllByTestId('delete-on-thumbnail')
      expect(images).toHaveLength(2)
      const audio = getByTestId('delete-audio-recording')
      expect(audio).toBeDefined()
    })

    it('should keep all fields except word if only word is updated', async () => {
      const { getByPlaceholderText, getByText } = renderWithStorageCache(
        storageCache,
        <UserVocabularyProcessScreen navigation={navigation} route={getRoute(itemToEdit)} />,
      )
      const textField = getByPlaceholderText(getLabels().userVocabulary.creation.wordPlaceholder)
      fireEvent.changeText(textField, 'new-word')
      const saveButton = getByText(getLabels().userVocabulary.creation.saveButton)
      fireEvent.press(saveButton)

      const shouldBe = { ...itemToEdit, word: 'new-word' }
      await waitFor(async () => {
        const userVocabulary = storageCache.getItem('userVocabulary')
        expect(userVocabulary).toEqual([shouldBe])
      })
    })

    it('should delete a photo', () => {
      jest.spyOn(ReactNativeFS, 'unlink')

      const { getByText, getAllByTestId } = render(
        <UserVocabularyProcessScreen navigation={navigation} route={getRoute(itemToEdit)} />,
      )
      expect(getAllByTestId('delete-on-thumbnail')).toHaveLength(2)
      const deleteThumbnail = getAllByTestId('delete-on-thumbnail')[0]
      fireEvent.press(deleteThumbnail)
      expect(getAllByTestId('delete-on-thumbnail')).toHaveLength(1)
      const saveButton = getByText(getLabels().userVocabulary.creation.saveButton)
      fireEvent.press(saveButton)

      expect(ReactNativeFS.unlink).toHaveBeenCalled()
    })
  })
})
