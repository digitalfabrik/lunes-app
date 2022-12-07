import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import SoundPlayer from 'react-native-sound-player'
import Tts, { Options, TtsError } from 'react-native-tts'
import styled, { useTheme } from 'styled-components/native'

import { VolumeUpCircleIcon } from '../../assets/images'
import PressableOpacity from './PressableOpacity'

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

type AudioPlayerProps = {
  disabled: boolean
  audio: string
  isTtsText?: boolean
}

const AudioPlayer = ({ audio, disabled, isTtsText = false }: AudioPlayerProps): ReactElement => {
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
    if (disabled) {
      return () => undefined
    }
    if (isTtsText) {
      initializeTts()
      return Tts.addListener('tts-finish', () => setIsActive(false)).remove
    }

    const onFinishedLoadingSubscription = SoundPlayer.addEventListener('FinishedLoadingURL', () => {
      SoundPlayer.play()
    })
    const onSoundPlayerFinishPlaying = SoundPlayer.addEventListener('FinishedPlaying', () => setIsActive(false))
    setIsInitialized(true)

    return () => {
      onFinishedLoadingSubscription.remove()
      onSoundPlayerFinishPlaying.remove()
    }
  }, [disabled, isTtsText, audio, initializeTts])

  const handleSpeakerClick = (): void => {
    if (isInitialized) {
      setIsActive(true)
      if (isTtsText) {
        // @ts-expect-error ios params should be optional
        const options: Options = {
          androidParams: {
            KEY_PARAM_PAN: 0,
            KEY_PARAM_VOLUME: 0.5,
            KEY_PARAM_STREAM: 'STREAM_MUSIC',
          },
        }
        Tts.speak(audio, options)
      } else {
        SoundPlayer.loadUrl(audio)
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
