import { mockUseLoadFromEndpointWitData } from '../../../testing/mockUseLoadFromEndpoint'

import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'

import WriteExerciseScreen from '../WriteExerciseScreen'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { RouteProp } from '@react-navigation/native'
import { RoutesParamsType } from '../../../navigation/NavigationTypes'

import { DocumentTypeFromServer } from '../../../hooks/useLoadDocuments'
import labels from '../../../constants/labels.json'
import {ReactTestInstance} from "react-test-renderer";

jest.mock('../../../components/AudioPlayer', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})

describe('WriteExerciseScreen', () => {
  const testDocuments: DocumentTypeFromServer[] = [
    {
      audio: '',
      word: 'Hallo',
      id: 1,
      article: 1,
      document_image: [{ id: 1, image: 'Arbeitshose' }],
      alternatives: []
    },
    {
      audio: '',
      word: 'Tschüss',
      id: 2,
      article: 3,
      document_image: [{ id: 2, image: 'Arbeitsschuhe' }],
      alternatives: []
    }
  ]

  const navigation = createNavigationMock()
  const route: RouteProp<RoutesParamsType, 'WriteExercise'> = {
    key: '',
    name: 'WriteExercise',
    params: {
      extraParams: {
        disciplineID: 0,
        disciplineIcon: 'Icon',
        disciplineTitle: 'Title',
        exercise: 4,
        exerciseDescription: 'Description',
        trainingSet: 'Set',
        trainingSetId: 0,
        level: 0
      }
    }
  }
  it('allows to skip an exercise and try it out later (except for last exercise)', async () => {
    mockUseLoadFromEndpointWitData(testDocuments)
      // @ts-expect-error
      const getUri = (image: ReactTestInstance) => image._fiber.stateNode.props.source.uri

    const { getByRole, getByText } = render(<WriteExerciseScreen route={route} navigation={navigation} />)
      const image = await getByRole('image')
      expect(getUri(image)).toBe('Arbeitshose')
      fireEvent.press(getByText(labels.exercises.write.tryLater))
      expect(getUri(image)).toBe('Arbeitsschuhe')
      fireEvent.press(getByText(labels.exercises.write.showSolution))
      fireEvent.press(getByText(labels.exercises.next))
      expect(getUri(image)).toBe('Arbeitshose')
  })

  it('does not allow to skip last exercise', () => {
    mockUseLoadFromEndpointWitData(testDocuments)
    const { queryByTestId, getByTestId } = render(<WriteExerciseScreen route={route} navigation={navigation} />)
    expect(queryByTestId('try-later')).not.toBeNull()
    fireEvent.press(getByTestId('give-up'))
    fireEvent.press(getByTestId('next-word'))
    expect(queryByTestId('try-later')).toBeNull()
  })
})
