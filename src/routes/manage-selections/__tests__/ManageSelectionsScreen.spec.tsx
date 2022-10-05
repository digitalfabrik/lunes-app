import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { useLoadDiscipline } from '../../../hooks/useLoadDiscipline'
import useReadCustomDisciplines from '../../../hooks/useReadCustomDisciplines'
import useReadSelectedProfessions from '../../../hooks/useReadSelectedProfessions'
import {
  getCustomDisciplines,
  getSelectedProfessions,
  pushSelectedProfession,
  setCustomDisciplines,
} from '../../../services/AsyncStorage'
import { getLabels } from '../../../services/helpers'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { getReturnOf } from '../../../testing/helper'
import { mockCustomDiscipline } from '../../../testing/mockCustomDiscipline'
import { mockDisciplines } from '../../../testing/mockDiscipline'
import render from '../../../testing/render'
import ManageSelectionsScreen from '../ManageSelectionsScreen'

jest.mock('@react-navigation/native')
jest.mock('../../../hooks/useReadCustomDisciplines')
jest.mock('../../../hooks/useReadSelectedProfessions')
jest.mock('../../../hooks/useLoadDiscipline')

describe('ManageSelectionsScreen', () => {
  const navigation = createNavigationMock<'ManageSelection'>()
  const renderScreen = () => render(<ManageSelectionsScreen navigation={navigation} />)

  it('should show and delete selected professions', async () => {
    mocked(useReadCustomDisciplines).mockReturnValueOnce(getReturnOf([]))
    await pushSelectedProfession(mockDisciplines()[0].id)
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf([mockDisciplines()[0].id]))
    mocked(useLoadDiscipline).mockReturnValue(getReturnOf(mockDisciplines()[0]))

    const { getByText, getByTestId } = renderScreen()
    expect(getByText(mockDisciplines()[0].title)).toBeDefined()
    const deleteIcon = getByTestId('delete-icon')
    fireEvent.press(deleteIcon)
    const confirmButton = getByText(getLabels().manageSelection.deleteModal.confirm)
    fireEvent.press(confirmButton)
    await waitFor(async () => {
      const selectedProfessions = await getSelectedProfessions()
      expect(selectedProfessions).toEqual([])
    })
  })

  it('should show and delete custom disciplines', async () => {
    mocked(useReadCustomDisciplines).mockReturnValueOnce(getReturnOf([mockCustomDiscipline.apiKey]))
    await setCustomDisciplines([mockCustomDiscipline.apiKey])
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf([]))
    mocked(useLoadDiscipline).mockReturnValueOnce(getReturnOf(mockCustomDiscipline))

    const { getByText, getByTestId } = renderScreen()
    expect(getByText(mockCustomDiscipline.title)).toBeDefined()
    const deleteIcon = getByTestId('delete-icon')
    fireEvent.press(deleteIcon)
    const confirmButton = getByText(getLabels().manageSelection.deleteModal.confirm)
    fireEvent.press(confirmButton)
    await waitFor(async () => {
      const customDisciplines = await getCustomDisciplines()
      expect(customDisciplines).toEqual([])
    })
  })

  it('should navigate to add custom discipline', () => {
    mocked(useReadCustomDisciplines).mockReturnValueOnce(getReturnOf([]))
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf([]))

    const { getByText } = renderScreen()
    const addCustomDisciplineText = getByText(getLabels().home.addCustomDiscipline)
    fireEvent.press(addCustomDisciplineText)
    expect(navigation.navigate).toHaveBeenCalledWith('AddCustomDiscipline')
  })

  it('should navigate to select another profession', () => {
    mocked(useReadCustomDisciplines).mockReturnValueOnce(getReturnOf([]))
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf([]))

    const { getByText } = renderScreen()
    const addProfessionText = getByText(getLabels().manageSelection.addProfession)
    fireEvent.press(addProfessionText)
    expect(navigation.navigate).toHaveBeenCalledWith('ScopeSelection', { initialSelection: false })
  })
})
