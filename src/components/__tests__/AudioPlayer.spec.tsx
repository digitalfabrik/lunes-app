import { fireEvent, RenderAPI, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'
import SoundPlayer from 'react-native-sound-player'
import Tts from 'react-native-tts'

import render from '../../testing/render'
import AudioPlayer from '../AudioPlayer'

jest.mock('react-native-tts', () => ({
  getInitStatus: jest.fn(async () => 'success'),
  setDefaultLanguage: jest.fn(async () => undefined),
  requestInstallEngine: jest.fn(async () => undefined),
  addListener: jest.fn(() => ({ remove: jest.fn() })),
  speak: jest.fn(),
}))

jest.mock('react-native-sound-player', () => ({
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  loadUrl: jest.fn(),
}))

describe('AudioPlayer', () => {
  beforeEach(jest.clearAllMocks)

  const audioPath = 'https://example.com'

  const renderAudioPlayer = ({
    audio = audioPath,
    isTtsText = false,
    disabled = false,
  }: {
    audio?: string
    isTtsText?: boolean
    disabled?: boolean
  }): RenderAPI => render(<AudioPlayer audio={audio} isTtsText={isTtsText} disabled={disabled} />)

  it('should initialize tts', async () => {
    renderAudioPlayer({ isTtsText: true })
    expect(Tts.getInitStatus).toHaveBeenCalled()

    await waitFor(() => expect(Tts.setDefaultLanguage).toHaveBeenCalledWith('de-DE'))
    expect(Tts.addListener).toHaveBeenCalledWith('tts-finish', expect.any(Function))

    expect(Tts.requestInstallEngine).not.toHaveBeenCalled()
    expect(SoundPlayer.addEventListener).not.toHaveBeenCalled()
  })

  it('should request to install tts engine', async () => {
    mocked(Tts.getInitStatus).mockRejectedValueOnce({ code: 'no_engine' })
    renderAudioPlayer({ isTtsText: true })

    expect(Tts.getInitStatus).toHaveBeenCalled()
    await waitFor(() => expect(Tts.requestInstallEngine).toHaveBeenCalledTimes(1))
    expect(Tts.addListener).toHaveBeenCalledWith('tts-finish', expect.any(Function))

    expect(Tts.setDefaultLanguage).not.toHaveBeenCalled()
    expect(SoundPlayer.addEventListener).not.toHaveBeenCalled()
  })

  it('should initialize sound player', () => {
    renderAudioPlayer({})
    expect(SoundPlayer.addEventListener).toHaveBeenCalledTimes(2)
    expect(SoundPlayer.addEventListener).toHaveBeenCalledWith('FinishedLoadingURL', expect.any(Function))
    expect(SoundPlayer.addEventListener).toHaveBeenCalledWith('FinishedPlaying', expect.any(Function))

    expect(Tts.getInitStatus).not.toHaveBeenCalled()
    expect(Tts.setDefaultLanguage).not.toHaveBeenCalled()
    expect(Tts.addListener).not.toHaveBeenCalled()
  })

  it('should be disabled', async () => {
    const { getByTestId } = renderAudioPlayer({ disabled: true })
    expect(getByTestId('audio-player')).toBeDisabled()

    fireEvent.press(getByTestId('audio-player'))

    expect(Tts.setDefaultLanguage).not.toHaveBeenCalledWith('de-DE')
    expect(SoundPlayer.loadUrl).not.toHaveBeenCalled()
    expect(Tts.speak).not.toHaveBeenCalled()
  })

  it('should play audio if it is not tts', () => {
    const { getByTestId } = renderAudioPlayer({})
    fireEvent.press(getByTestId('audio-player'))

    expect(SoundPlayer.loadUrl).toHaveBeenCalledTimes(1)
    expect(SoundPlayer.loadUrl).toHaveBeenCalledWith(audioPath)
    expect(Tts.speak).not.toHaveBeenCalled()
  })

  it('should play audio if it is tts', async () => {
    const ttsText = 'Die Spachtel'
    const { getByTestId } = renderAudioPlayer({ audio: ttsText, isTtsText: true })
    await waitFor(() => expect(Tts.setDefaultLanguage).toHaveBeenCalledWith('de-DE'))

    fireEvent.press(getByTestId('audio-player'))

    expect(Tts.speak).toHaveBeenCalledTimes(1)
    expect(Tts.speak).toHaveBeenCalledWith(ttsText, expect.any(Object))
    expect(SoundPlayer.loadUrl).not.toHaveBeenCalled()
  })
})
