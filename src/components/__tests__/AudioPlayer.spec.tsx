import { fireEvent, RenderAPI, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'
import SoundPlayer from 'react-native-sound-player'
import Tts from 'react-native-tts'

import { ARTICLES } from '../../constants/data'
import { Document } from '../../constants/endpoints'
import { stringifyDocument } from '../../services/helpers'
import render from '../../testing/render'
import AudioPlayer from '../AudioPlayer'

jest.mock('react-native-tts', () => ({
  getInitStatus: jest.fn(async () => 'success'),
  setDefaultLanguage: jest.fn(async () => undefined),
  requestInstallEngine: jest.fn(async () => undefined),
  addListener: jest.fn(() => ({ remove: jest.fn() })),
  speak: jest.fn()
}))

jest.mock('react-native-sound-player', () => ({
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  loadUrl: jest.fn()
}))

describe('AudioPlayer', () => {
  const noAudioDocument = {
    alternatives: [],
    article: ARTICLES[4],
    audio: '',
    id: 0,
    document_image: [],
    word: 'Abrissbirne'
  }

  const audioDocument = {
    ...noAudioDocument,
    audio: 'https://example.com'
  }

  const renderAudioPlayer = ({
    document = noAudioDocument,
    submittedAlternative = null,
    disabled = false
  }: {
    document?: Document
    submittedAlternative?: string | null
    disabled?: boolean
  }): RenderAPI =>
    render(<AudioPlayer document={document} disabled={disabled} submittedAlternative={submittedAlternative} />)

  it('should initialize tts', async () => {
    renderAudioPlayer({})
    expect(Tts.getInitStatus).toHaveBeenCalled()

    await waitFor(() => expect(Tts.setDefaultLanguage).toHaveBeenCalledWith('de-DE'))
    expect(Tts.addListener).toHaveBeenCalledWith('tts-finish', expect.any(Function))

    expect(Tts.requestInstallEngine).not.toHaveBeenCalled()
    expect(SoundPlayer.addEventListener).not.toHaveBeenCalled()
  })

  it('should initialize tts if alternative submitted', async () => {
    renderAudioPlayer({ document: audioDocument, submittedAlternative: 'asdf' })
    expect(Tts.getInitStatus).toHaveBeenCalled()

    await waitFor(() => expect(Tts.setDefaultLanguage).toHaveBeenCalledWith('de-DE'))
    expect(Tts.addListener).toHaveBeenCalledWith('tts-finish', expect.any(Function))

    expect(Tts.requestInstallEngine).not.toHaveBeenCalled()
    expect(SoundPlayer.addEventListener).not.toHaveBeenCalled()
  })

  it('should request to install tts engine', async () => {
    mocked(Tts.getInitStatus).mockRejectedValueOnce({ code: 'no_engine' })
    renderAudioPlayer({})

    expect(Tts.getInitStatus).toHaveBeenCalled()
    await waitFor(() => expect(Tts.requestInstallEngine).toHaveBeenCalledTimes(1))
    expect(Tts.addListener).toHaveBeenCalledWith('tts-finish', expect.any(Function))

    expect(Tts.setDefaultLanguage).not.toHaveBeenCalled()
    expect(SoundPlayer.addEventListener).not.toHaveBeenCalled()
  })

  it('should initialize sound player', () => {
    jest.clearAllMocks()
    renderAudioPlayer({ document: audioDocument })
    expect(SoundPlayer.addEventListener).toHaveBeenCalledTimes(2)
    expect(SoundPlayer.addEventListener).toHaveBeenCalledWith('FinishedLoadingURL', expect.any(Function))
    expect(SoundPlayer.addEventListener).toHaveBeenCalledWith('FinishedPlaying', expect.any(Function))

    expect(Tts.getInitStatus).not.toHaveBeenCalled()
    expect(Tts.setDefaultLanguage).not.toHaveBeenCalled()
    expect(Tts.addListener).not.toHaveBeenCalled()
  })

  it('should be disabled', async () => {
    const { getByRole } = renderAudioPlayer({ disabled: true })
    expect(getByRole('button')).toBeDisabled()
    await waitFor(() => expect(Tts.setDefaultLanguage).toHaveBeenCalledWith('de-DE'))

    fireEvent.press(getByRole('button'))

    expect(SoundPlayer.loadUrl).not.toHaveBeenCalled()
    expect(Tts.speak).not.toHaveBeenCalled()
  })

  it('should play audio if available and no alternative solution submitted', () => {
    const { getByRole } = renderAudioPlayer({ document: audioDocument })
    fireEvent.press(getByRole('button'))

    expect(SoundPlayer.loadUrl).toHaveBeenCalledTimes(1)
    expect(SoundPlayer.loadUrl).toHaveBeenCalledWith(audioDocument.audio)
    expect(Tts.speak).not.toHaveBeenCalled()
  })

  it('should play submitted alternative', async () => {
    const submittedAlternative = 'my alternative'
    const { getByRole } = renderAudioPlayer({ document: audioDocument, submittedAlternative })
    await waitFor(() => expect(Tts.setDefaultLanguage).toHaveBeenCalledWith('de-DE'))

    fireEvent.press(getByRole('button'))

    expect(Tts.speak).toHaveBeenCalledTimes(1)
    expect(Tts.speak).toHaveBeenCalledWith(submittedAlternative, expect.any(Object))
    expect(SoundPlayer.loadUrl).not.toHaveBeenCalled()
  })

  it('should play tts if no audio available and no alternative submitted', async () => {
    const { getByRole } = renderAudioPlayer({})
    await waitFor(() => expect(Tts.setDefaultLanguage).toHaveBeenCalledWith('de-DE'))

    fireEvent.press(getByRole('button'))

    expect(Tts.speak).toHaveBeenCalledTimes(1)
    expect(Tts.speak).toHaveBeenCalledWith(stringifyDocument(noAudioDocument), expect.any(Object))
    expect(SoundPlayer.loadUrl).not.toHaveBeenCalled()
  })
})
