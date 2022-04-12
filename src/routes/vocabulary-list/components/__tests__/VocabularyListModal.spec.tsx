import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import labels from '../../../../constants/labels.json'
import DocumentBuilder from '../../../../testing/DocumentBuilder'
import render from '../../../../testing/render'
import VocabularyListModal from '../VocabularyListModal'

jest.mock('../../../../components/FavoriteButton', () => () => {
  const { Text } = require('react-native')
  return <Text>FavoriteButton</Text>
})

jest.mock('../../../../components/AudioPlayer', () => {
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})

describe('VocabularyListModal', () => {
  const documents = new DocumentBuilder(2).build()

  const setIsModalVisible = jest.fn()
  const setSelectedDocumentIndex = jest.fn()

  it('should update current document', () => {
    const { getByText } = render(
      <VocabularyListModal
        documents={documents}
        isModalVisible
        setIsModalVisible={setIsModalVisible}
        selectedDocumentIndex={0}
        setSelectedDocumentIndex={setSelectedDocumentIndex}
      />
    )
    const button = getByText(labels.exercises.next)
    expect(button).toBeDefined()
    fireEvent.press(button)
    expect(setSelectedDocumentIndex).toHaveBeenCalledTimes(1)
  })

  it('should close modal for last word', () => {
    const { getByText } = render(
      <VocabularyListModal
        documents={documents}
        isModalVisible
        setIsModalVisible={setIsModalVisible}
        selectedDocumentIndex={1}
        setSelectedDocumentIndex={setSelectedDocumentIndex}
      />
    )
    const button = getByText(labels.general.header.cancelExercise)
    expect(button).toBeDefined()
    fireEvent.press(button)
    expect(setIsModalVisible).toHaveBeenCalledTimes(1)
  })
})
