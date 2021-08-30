import { mockUseLoadFromEndpointWitData } from '../../../testing/mockUseLoadFromEndpoint'

import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'

import WriteExerciseScreen from '../WriteExerciseScreen'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { RouteProp } from '@react-navigation/native'
import { RoutesParamsType } from '../../../navigation/NavigationTypes'

import { DocumentTypeFromServer } from '../../../hooks/useLoadDocuments'

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
  it('allows to skip an exercise and try it out later (except for last exercise)', () => {
    mockUseLoadFromEndpointWitData(testDocuments)
    const { queryByRole, getByTestId, debug } = render(<WriteExerciseScreen route={route} navigation={navigation} />)
    debug()
    let tryLaterButton = getByTestId('try-later')
    let i1 = queryByRole('image')
    fireEvent.press(tryLaterButton)
    // check if image changed, maybe compare uri from source
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
