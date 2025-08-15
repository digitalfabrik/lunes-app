import { fireEvent, RenderAPI, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'
import SoundPlayer from 'react-native-sound-player'
import Tts from 'react-native-tts'

import TtsServiceProvider from '../../services/TtsService'
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

  const renderAudioPlayer = async ({
    audio = audioPath,
    isTtsText = false,
    disabled = false,
  }: {
    audio?: string
    isTtsText?: boolean
    disabled?: boolean
  }): Promise<RenderAPI> => {
    const api = render(
      <TtsServiceProvider>
        <AudioPlayer audio={audio} isTtsText={isTtsText} disabled={disabled} />
      </TtsServiceProvider>,
    )

    // Wait until tts has initialized
    await waitFor(() => expect(Tts.getInitStatus).toHaveBeenCalled())

    return api
  }

  it('should initialize tts', async () => {
    await renderAudioPlayer({ isTtsText: true })

    expect(Tts.setDefaultLanguage).toHaveBeenCalledWith('de-DE')
    expect(Tts.addListener).toHaveBeenCalledWith('tts-finish', expect.any(Function))

    expect(Tts.requestInstallEngine).not.toHaveBeenCalled()
    expect(SoundPlayer.addEventListener).not.toHaveBeenCalled()
    expect(Tts.requestInstallEngine).not.toHaveBeenCalled()
  })

  it('should request to install tts engine', async () => {
    mocked(Tts.getInitStatus).mockRejectedValue({ code: 'no_engine' })
    const ttsText = 'Die Spachtel'
    const { findByTestId } = await renderAudioPlayer({ audio: ttsText, isTtsText: true })

    expect(Tts.addListener).toHaveBeenCalledWith('tts-finish', expect.any(Function))

    expect(SoundPlayer.addEventListener).not.toHaveBeenCalled()

    const button = await findByTestId('audio-player')
    expect(button).not.toBeDisabled()
    fireEvent.press(button)

    await waitFor(() => expect(Tts.requestInstallEngine).toHaveBeenCalled())
    mocked(Tts.getInitStatus).mockResolvedValue('success')
  })

  it('should initialize sound player', async () => {
    await renderAudioPlayer({})
    expect(SoundPlayer.addEventListener).toHaveBeenCalledTimes(2)
    expect(SoundPlayer.addEventListener).toHaveBeenCalledWith('FinishedLoadingURL', expect.any(Function))
    expect(SoundPlayer.addEventListener).toHaveBeenCalledWith('FinishedPlaying', expect.any(Function))
  })

  it('should be disabled', async () => {
    const { getByTestId } = await renderAudioPlayer({ disabled: true })
    expect(getByTestId('audio-player')).toBeDisabled()

    fireEvent.press(getByTestId('audio-player'))

    expect(SoundPlayer.loadUrl).not.toHaveBeenCalled()
    expect(Tts.speak).not.toHaveBeenCalled()
  })

  it('should play audio if it is not tts', async () => {
    const { getByTestId } = await renderAudioPlayer({})
    fireEvent.press(getByTestId('audio-player'))

    expect(SoundPlayer.loadUrl).toHaveBeenCalledTimes(1)
    expect(SoundPlayer.loadUrl).toHaveBeenCalledWith(audioPath)
    expect(Tts.speak).not.toHaveBeenCalled()
  })

  it('should play audio if it is tts', async () => {
    const ttsText = 'Die Spachtel'
    const { getByTestId } = await renderAudioPlayer({ audio: ttsText, isTtsText: true })

    fireEvent.press(getByTestId('audio-player'))

    expect(Tts.speak).toHaveBeenCalledTimes(1)
    expect(Tts.speak).toHaveBeenCalledWith(ttsText, expect.any(Object))
    expect(SoundPlayer.loadUrl).not.toHaveBeenCalled()
  })
})
