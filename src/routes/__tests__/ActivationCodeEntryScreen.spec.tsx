import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { InvalidContentAreaCodeError } from '../../constants/endpoints'
import { redeemContentAreaCode } from '../../services/ContentAreaService'
import { StorageCache } from '../../services/Storage'
import { getLabels } from '../../services/helpers'
import createNavigationMock from '../../testing/createNavigationPropMock'
import { renderWithStorageCache } from '../../testing/render'
import ActivationCodeEntryScreen from '../ActivationCodeEntryScreen'

jest.mock('../../services/ContentAreaService')
jest.mock('../../services/sentry')

describe('ActivationCodeEntryScreen', () => {
  const navigation = createNavigationMock<'ActivationCodeEntry'>()
  let storageCache: StorageCache

  beforeEach(() => {
    storageCache = StorageCache.createDummy()
    mocked(redeemContentAreaCode).mockResolvedValue({
      id: 1,
      token: 'telc_token',
      name: 'telc gGmbH',
      code: 'TELC2026',
    })
  })

  const renderScreen = () => renderWithStorageCache(storageCache, <ActivationCodeEntryScreen navigation={navigation} />)

  const enterCode = (getByPlaceholderText: ReturnType<typeof renderScreen>['getByPlaceholderText'], code: string) =>
    fireEvent.changeText(getByPlaceholderText(getLabels().activationCodeEntry.placeholder), code)

  it('should display the description', () => {
    const { getByText } = renderScreen()

    expect(getByText(getLabels().activationCodeEntry.description)).toBeTruthy()
  })

  it('should remove all whitespace from a pasted code', () => {
    const { getByPlaceholderText } = renderScreen()

    enterCode(getByPlaceholderText, '  TELC 20\n')

    expect(getByPlaceholderText(getLabels().activationCodeEntry.placeholder).props.value).toBe('TELC20')
  })

  it('should disable the add button as long as no code is entered', () => {
    const { getByTestId } = renderScreen()

    expect(getByTestId('activation-code-entry-add-button')).toBeDisabled()
  })

  it('should redeem the entered code and show the jobs of the content area when add is pressed', async () => {
    const { getByPlaceholderText, getByTestId } = renderScreen()

    enterCode(getByPlaceholderText, ' TELC20 ')
    fireEvent.press(getByTestId('activation-code-entry-add-button'))

    await waitFor(() =>
      expect(navigation.replace).toHaveBeenCalledWith('JobSelection', {
        initialSelection: false,
        jobScope: { type: 'contentArea', token: 'telc_token' },
      }),
    )
    expect(redeemContentAreaCode).toHaveBeenCalledWith(storageCache, 'TELC20')
  })

  it('should also redeem the code when submitted via the keyboard', async () => {
    const { getByPlaceholderText } = renderScreen()

    enterCode(getByPlaceholderText, 'TELC20')
    fireEvent(getByPlaceholderText(getLabels().activationCodeEntry.placeholder), 'submitEditing')

    await waitFor(() => expect(redeemContentAreaCode).toHaveBeenCalledWith(storageCache, 'TELC20'))
  })

  it('should not redeem when the code is empty', () => {
    const { getByPlaceholderText } = renderScreen()

    fireEvent(getByPlaceholderText(getLabels().activationCodeEntry.placeholder), 'submitEditing')

    expect(redeemContentAreaCode).not.toHaveBeenCalled()
  })

  it('should show an error below the input if the code does not exist', async () => {
    mocked(redeemContentAreaCode).mockRejectedValue(new Error(InvalidContentAreaCodeError))
    const { getByPlaceholderText, getByTestId, findByText } = renderScreen()

    enterCode(getByPlaceholderText, 'WRONG')
    fireEvent.press(getByTestId('activation-code-entry-add-button'))

    expect(await findByText(getLabels().activation.error.wrongCode)).toBeTruthy()
    expect(navigation.replace).not.toHaveBeenCalled()
  })

  it('should accept letters and digits without auto-correction, since codes are alphanumeric', () => {
    const { getByPlaceholderText } = renderScreen()

    const input = getByPlaceholderText(getLabels().activationCodeEntry.placeholder)
    expect(input.props.autoCorrect).toBe(false)
    expect(input.props.keyboardType).not.toBe('number-pad')
  })
})
