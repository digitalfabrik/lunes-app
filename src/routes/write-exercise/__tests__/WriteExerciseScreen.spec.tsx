import { mockUseLoadFromEndpointWitData } from '../../../testing/mockUseLoadFromEndpoint'

import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'

import WriteExerciseScreen from '../WriteExerciseScreen'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { RouteProp } from '@react-navigation/native'
import { RoutesParamsType } from '../../../navigation/NavigationTypes'

import { DocumentTypeFromServer } from '../../../hooks/useLoadDocuments'



describe('WriteExerciseScreen', () => {
    const testDocuments: DocumentTypeFromServer[] = [{
      audio: '',
      word: 'Hallo',
      id: 1,
      article: 1,
      document_image: [{ id: 1, image: "img1" }],
      alternatives: []
    },
      {
        audio: '',
        word: 'Tschüss',
        id: 2,
        article: 3,
        document_image: [{ id: 2, image: 'img2' }],
        alternatives: []
      }]

    const navigation = createNavigationMock()
    const route:
      RouteProp<RoutesParamsType, 'WriteExercise'>
      = {
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
      // const {queryByRole, queryByText, queryByTestId, getByTestId} = render(<WriteExerciseScreen route={route} navigation={navigation}/>)

      mockUseLoadFromEndpointWitData(testDocuments)
      const { queryByRole, queryByText, queryByTestId, getByTestId, findByTestId, debug } = render(<WriteExerciseScreen route={route}
                                                                                                   navigation={navigation} />)
      debug()
      //let tryLaterButton = getByTestId('modal')
      //let i1 = queryByRole('image')
      //fireEvent.press(tryLaterButton)
      //expect(i1).not.toEqual(queryByRole('image'))


    })

    it('does not allow to skip last exercise', () => {
      let c = <WriteExerciseScreen route={route} navigation={navigation} />
      render(c)
    })
  }
)
