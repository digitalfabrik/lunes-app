import React from 'react-native'
import VocabularyListModal from '../VocabularyListModal'
import { DocumentsType } from '../../../../constants/endpoints'
import { render, fireEvent } from '@testing-library/react-native'
import labels from '../../../../constants/labels.json'

describe('VocabularyListModal', () => {
  const documents: DocumentsType = [
    {
      id: 1,
      word: 'Hammer',
      article: {
        id: 1,
        value: 'Der'
      },
      document_image: [],
      audio: 'string',
      alternatives: []
    },
    {
      id: 2,
      word: 'Nagel',
      article: {
        id: 1,
        value: 'Der'
      },
      document_image: [],
      audio: '',
      alternatives: []
    }
  ]

  const setIsModalVisible = jest.fn()
  const setSelectedDocumentIndex = jest.fn()

  it.skip('should update current document', async () => {
    const { getByText } = render(
      <VocabularyListModal
        documents={documents}
        isModalVisible={true}
        setIsModalVisible={setIsModalVisible}
        selectedDocumentIndex={0}
        setSelectedDocumentIndex={setSelectedDocumentIndex}
      />
    )
    const button = await getByText(labels.exercises.next)
    expect(button).toBeDefined()
  })
})
