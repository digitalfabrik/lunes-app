import React, { ReactElement, useCallback, useState, useEffect } from 'react'
import SoundPlayer from 'react-native-sound-player'
import Tts, { TtsError } from 'react-native-tts'
import styled, { useTheme } from 'styled-components/native'

import { VolumeUpCircleIcon } from '../../assets/images'
import { VocabularyItem } from '../constants/endpoints'
import { stringifyDocument } from '../services/helpers'
import PressableOpacity from './PressableOpacity'

export interface AudioPlayerProps {
  vocabularyItem: VocabularyItem
  disabled: boolean
  // If the user submitted a correct alternative (differing enough to the vocabularyItem), we want to play the alternative
  submittedAlternative?: string | null
}

const VolumeIcon = styled(PressableOpacity)<{ disabled: boolean; isActive: boolean }>`
  width: ${props => props.theme.spacings.lg};
  height: ${props => props.theme.spacings.lg};
  border-radius: 50px;
  background-color: ${props => {
    if (props.disabled) {
      return props.theme.colors.disabled
    }
    if (props.isActive) {
      return props.theme.colors.audioIconSelected
    }
    return props.theme.colors.audioIconHighlight
  }};
  justify-content: center;
  align-items: center;
  shadow-color: ${props => props.theme.colors.shadow};
  elevation: 8;
  shadow-radius: 5px;
  shadow-offset: 1px 1px;
  shadow-opacity: 0.5;
`

const AudioPlayer = ({ vocabularyItem, disabled, submittedAlternative }: AudioPlayerProps): ReactElement => {
  const { audio } = vocabularyItem
  const theme = useTheme()
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [isActive, setIsActive] = useState(false)

  const initializeTts = useCallback((): void => {
    Tts.getInitStatus()
      .then(async status => {
        // Status does not have to be 'success'
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (status === 'success') {
          setIsInitialized(true)
          await Tts.setDefaultLanguage('de-DE')
        }
      })
      .catch(async (error: TtsError) => {
        /* eslint-disable-next-line no-console */
        console.error(`Tts-Error: ${error.code}`)
        if (error.code === 'no_engine') {
          /* eslint-disable-next-line no-console */
          await Tts.requestInstallEngine().catch(e => console.error('Failed to install tts engine: ', e))
        }
      })
  }, [])

  useEffect(() => {
    if (audio && !submittedAlternative) {
      const onFinishedLoadingSubscription = SoundPlayer.addEventListener('FinishedLoadingURL', () => {
        SoundPlayer.play()
      })
      const onSoundPlayerFinishPlaying = SoundPlayer.addEventListener('FinishedPlaying', () => setIsActive(false))
      setIsInitialized(true)

      return () => {
        onFinishedLoadingSubscription.remove()
        onSoundPlayerFinishPlaying.remove()
      }
    }
    initializeTts()

    const ttsHandler = (): void => setIsActive(false)
    const listener = Tts.addListener('tts-finish', ttsHandler)

    return listener.remove
  }, [submittedAlternative, audio, initializeTts])

  const handleSpeakerClick = (): void => {
    if (isInitialized) {
      setIsActive(true)
      if (audio && !submittedAlternative) {
        SoundPlayer.loadUrl(audio)
      } else {
        // @ts-expect-error ios params should be optional
        Tts.speak(submittedAlternative ?? stringifyDocument(vocabularyItem), {
          androidParams: {
            KEY_PARAM_PAN: 0,
            KEY_PARAM_VOLUME: 0.5,
            KEY_PARAM_STREAM: 'STREAM_MUSIC',
          },
        })
      }
    }
  }

  return (
    <VolumeIcon
      disabled={disabled || !isInitialized}
      isActive={isActive}
      onPress={handleSpeakerClick}
      testID='audio-player'>
      <VolumeUpCircleIcon width={theme.spacingsPlain.lg} height={theme.spacingsPlain.lg} />
    </VolumeIcon>
  )
}

export default AudioPlayer
