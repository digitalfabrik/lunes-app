import { fireEvent, RenderAPI, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'
import SoundPlayer from 'react-native-sound-player'
import Tts from 'react-native-tts'

import { VocabularyItem } from '../../constants/endpoints'
import { stringifyVocabularyItem } from '../../services/helpers'
import VocabularyItemBuilder from '../../testing/VocabularyItemBuilder'
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
  const noAudioVocabularyItem = new VocabularyItemBuilder(2).build()[1]

  const audioVocabularyItem = {
    ...noAudioVocabularyItem,
    audio: 'https://example.com',
  }

  const renderVocabularyPlayer = ({
    vocabularyItem = noAudioVocabularyItem,
    submittedAlternative = null,
    disabled = false,
  }: {
    vocabularyItem?: VocabularyItem
    submittedAlternative?: string | null
    disabled?: boolean
  }): RenderAPI =>
    render(
      <AudioPlayer vocabularyItem={vocabularyItem} disabled={disabled} submittedAlternative={submittedAlternative} />
    )

  const renderAudioPlayer = ({
    submittedAlternative = null,
    disabled = false,
    audioPath = 'defaultPAth',
  }: {
    submittedAlternative?: string | null
    disabled?: boolean
    audioPath: string
  }): RenderAPI =>
    render(<AudioPlayer audioPath={audioPath} disabled={disabled} submittedAlternative={submittedAlternative} />)

  it('should initialize tts', async () => {
    renderVocabularyPlayer({})
    expect(Tts.getInitStatus).toHaveBeenCalled()

    await waitFor(() => expect(Tts.setDefaultLanguage).toHaveBeenCalledWith('de-DE'))
    expect(Tts.addListener).toHaveBeenCalledWith('tts-finish', expect.any(Function))

    expect(Tts.requestInstallEngine).not.toHaveBeenCalled()
    expect(SoundPlayer.addEventListener).not.toHaveBeenCalled()
  })

  it('should initialize tts if alternative submitted', async () => {
    renderVocabularyPlayer({ vocabularyItem: audioVocabularyItem, submittedAlternative: 'asdf' })
    expect(Tts.getInitStatus).toHaveBeenCalled()

    await waitFor(() => expect(Tts.setDefaultLanguage).toHaveBeenCalledWith('de-DE'))
    expect(Tts.addListener).toHaveBeenCalledWith('tts-finish', expect.any(Function))

    expect(Tts.requestInstallEngine).not.toHaveBeenCalled()
    expect(SoundPlayer.addEventListener).not.toHaveBeenCalled()
  })

  it('should request to install tts engine', async () => {
    mocked(Tts.getInitStatus).mockRejectedValueOnce({ code: 'no_engine' })
    renderVocabularyPlayer({})

    expect(Tts.getInitStatus).toHaveBeenCalled()
    await waitFor(() => expect(Tts.requestInstallEngine).toHaveBeenCalledTimes(1))
    expect(Tts.addListener).toHaveBeenCalledWith('tts-finish', expect.any(Function))

    expect(Tts.setDefaultLanguage).not.toHaveBeenCalled()
    expect(SoundPlayer.addEventListener).not.toHaveBeenCalled()
  })

  it('should initialize sound player', () => {
    jest.clearAllMocks()
    renderVocabularyPlayer({ vocabularyItem: audioVocabularyItem })
    expect(SoundPlayer.addEventListener).toHaveBeenCalledTimes(2)
    expect(SoundPlayer.addEventListener).toHaveBeenCalledWith('FinishedLoadingURL', expect.any(Function))
    expect(SoundPlayer.addEventListener).toHaveBeenCalledWith('FinishedPlaying', expect.any(Function))

    expect(Tts.getInitStatus).not.toHaveBeenCalled()
    expect(Tts.setDefaultLanguage).not.toHaveBeenCalled()
    expect(Tts.addListener).not.toHaveBeenCalled()
  })

  it('should be disabled', async () => {
    const { getByTestId } = renderVocabularyPlayer({ disabled: true })
    expect(getByTestId('audio-player')).toBeDisabled()
    await waitFor(() => expect(Tts.setDefaultLanguage).toHaveBeenCalledWith('de-DE'))

    fireEvent.press(getByTestId('audio-player'))

    expect(SoundPlayer.loadUrl).not.toHaveBeenCalled()
    expect(Tts.speak).not.toHaveBeenCalled()
  })

  it('should play audio if available and no alternative solution submitted', () => {
    const { getByTestId } = renderVocabularyPlayer({ vocabularyItem: audioVocabularyItem })
    fireEvent.press(getByTestId('audio-player'))

    expect(SoundPlayer.loadUrl).toHaveBeenCalledTimes(1)
    expect(SoundPlayer.loadUrl).toHaveBeenCalledWith(audioVocabularyItem.audio)
    expect(Tts.speak).not.toHaveBeenCalled()
  })

  it('should play submitted alternative', async () => {
    const submittedAlternative = 'my alternative'
    const { getByTestId } = renderVocabularyPlayer({ vocabularyItem: audioVocabularyItem, submittedAlternative })
    await waitFor(() => expect(Tts.setDefaultLanguage).toHaveBeenCalledWith('de-DE'))

    fireEvent.press(getByTestId('audio-player'))

    expect(Tts.speak).toHaveBeenCalledTimes(1)
    expect(Tts.speak).toHaveBeenCalledWith(submittedAlternative, expect.any(Object))
    expect(SoundPlayer.loadUrl).not.toHaveBeenCalled()
  })

  it('should play tts if no audio available and no alternative submitted', async () => {
    const { getByTestId } = renderVocabularyPlayer({})
    await waitFor(() => expect(Tts.setDefaultLanguage).toHaveBeenCalledWith('de-DE'))

    fireEvent.press(getByTestId('audio-player'))

    expect(Tts.speak).toHaveBeenCalledTimes(1)
    expect(Tts.speak).toHaveBeenCalledWith(stringifyVocabularyItem(noAudioVocabularyItem), expect.any(Object))
    expect(SoundPlayer.loadUrl).not.toHaveBeenCalled()
  })

  it('should play a sound file if just a audioPath was passed', async () => {
    const audioPath = 'path/test.mp3'
    const { getByTestId } = renderAudioPlayer({ audioPath })
    fireEvent.press(getByTestId('audio-player'))

    expect(SoundPlayer.loadUrl).toHaveBeenCalledTimes(1)
    expect(SoundPlayer.loadUrl).toHaveBeenCalledWith(audioPath)
    expect(Tts.speak).not.toHaveBeenCalled()
  })
})
