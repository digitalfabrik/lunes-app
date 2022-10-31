import { CommonActions, RouteProp } from '@react-navigation/native'
import React from 'react'

import { RoutesParams } from '../../navigation/NavigationTypes'
import {getCustomDisciplines, setExerciseProgress, setSelectedProfessions} from '../../services/AsyncStorage'
import { getLabels } from '../../services/helpers'
import DocumentBuilder from '../../testing/DocumentBuilder'
import createNavigationMock from '../../testing/createNavigationPropMock'
import { mockUseLoadAsyncWithData } from '../../testing/mockUseLoadFromEndpoint'
import render from '../../testing/render'
import VocabularyListScreen from '../VocabularyListScreen'
import {mockDisciplines} from "../../testing/mockDiscipline";
import {mocked} from "jest-mock";
import {useLoadDisciplines} from "../../hooks/useLoadDisciplines";
import {getReturnOf} from "../../testing/helper";
import useReadSelectedProfessions from "../../hooks/useReadSelectedProfessions";
import ProfessionSelectionScreen from "../ProfessionSelectionScreen";
import DisciplineSelectionScreen from "../DisciplineSelectionScreen";
import {fireEvent, waitFor} from "@testing-library/react-native";
import {EXERCISES} from "../../constants/data";

jest.mock('@react-navigation/native')
jest.mock('../../hooks/useLoadDisciplines')
jest.mock('../../hooks/useReadSelectedProfessions')

describe('DisciplineSelectionScreen', () => {
  const navigation = createNavigationMock<'DisciplineSelection'>()
  const getRoute = (): RouteProp<RoutesParams, 'DisciplineSelection'> => ({
    key: 'key-1',
    name: 'DisciplineSelection',
    params: {
      discipline: mockDisciplines()[1],
    },
  })


  it('should display the correct title',  () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf([mockDisciplines()[0].id]))

    const {getByText } = render(<DisciplineSelectionScreen route={getRoute()} navigation={navigation} />)
    const title = getByText(mockDisciplines()[0].title)
    expect(title).toBeDefined()
  })

  it('should display disciplines in the correct order', () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    const {getByTestId} = render(<DisciplineSelectionScreen route={getRoute()} navigation={navigation}/>)

    const list = getByTestId('list')
    expect(list).toBeDefined()
    // expect(list.children.keys()[0])

  })

  it('should display all disciplines', () => {
        mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
        mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf([mockDisciplines()[0].id]))
        const {findByText} = render(<DisciplineSelectionScreen route={getRoute()} navigation={navigation}/>)

        Object.keys(mockDisciplines()).forEach(d => expect(findByText(d)).toBeDefined())
      })

  it('should navigate to exercises when list item pressed', async () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf([mockDisciplines()[0].id]))


    const {getByText} = render(<DisciplineSelectionScreen route={getRoute()} navigation={navigation}/>)
    const discipline = getByText(mockDisciplines()[0].description)
    expect(discipline).toBeDefined()
    fireEvent.press(discipline)

    // TODO navigation gets not called at all. Don't know why.
    await waitFor(() => expect(navigation.navigate).toHaveBeenCalledWith('Exercises'))

    // expect(navigation.navigate).toHaveBeenCalledWith(EXERCISES[1].screen, {
    //   documents: route.params.documents,
    //   disciplineId: route.params.disciplineId,
    //   disciplineTitle: route.params.disciplineTitle,
    //   closeExerciseAction: route.params.closeExerciseAction,
    // })
  })


})
