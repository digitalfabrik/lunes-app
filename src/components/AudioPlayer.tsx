import React, { ReactElement, useCallback, useState } from 'react'
import SoundPlayer from 'react-native-sound-player'
import Tts, { TtsError } from 'react-native-tts'
import styled from 'styled-components/native'

import { VolumeUp } from '../../assets/images'
import { DocumentType } from '../constants/endpoints'

export interface AudioPlayerProps {
  document: DocumentType
  disabled: boolean
  TTSToPlay?: string
}

const StyledView = styled.View`
  align-items: center;
  margin-bottom: 20px;
`

const VolumeIcon = styled.TouchableOpacity<{ disabled: boolean; isActive: boolean }>`
  position: absolute;
  top: -20px;
  left: 45%;
  width: 40px;
  height: 40px;
  border-radius: 50px;
  background-color: ${props =>
    props.disabled
      ? props.theme.colors.lunesBlackUltralight
      : props.isActive
      ? props.theme.colors.lunesRed
      : props.theme.colors.lunesRedDark};
  justify-content: center;
  align-items: center;
  shadow-color: ${props => props.theme.colors.shadow};
  elevation: 8;
  shadow-radius: 5px;
  shadow-offset: 1px 1px;
  shadow-opacity: 0.5;
`

const AudioPlayer = (props: AudioPlayerProps): ReactElement => {
  const { document, disabled, TTSToPlay } = props
  const { audio } = document
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [isActive, setIsActive] = useState(false)

  const initializeTts = useCallback((): void => {
    Tts.getInitStatus()
      .then(async status => {
        if (status === 'success') {
          setIsInitialized(true)
          await Tts.setDefaultLanguage('de-DE')
        }
      })
      .catch(async (error: TtsError) => {
        console.error(`Tts-Error: ${error.code}`)
        if (error.code === 'no_engine') {
          await Tts.requestInstallEngine().catch(e => console.error('Failed to install tts engine: ', e))
        }
      })
  }, [])

  React.useEffect(() => {
    if (audio && !TTSToPlay) {
      const _onFinishedLoadingSubscription = SoundPlayer.addEventListener('FinishedLoadingURL', () => {
        SoundPlayer.play()
      })
      const _onSoundPlayerFinishPlaying = SoundPlayer.addEventListener('FinishedPlaying', () => setIsActive(false))
      setIsInitialized(true)

      return () => {
        _onFinishedLoadingSubscription.remove()
        _onSoundPlayerFinishPlaying.remove()
      }
    } else {
      initializeTts()

      const ttsHandler = (): void => setIsActive(false)
      Tts.addEventListener('tts-finish', ttsHandler)

      return () => {
        Tts.removeEventListener('tts-finish', ttsHandler)
      }
    }
  }, [audio, initializeTts, TTSToPlay])

  const handleSpeakerClick = (): void => {
    if (isInitialized) {
      setIsActive(true)
      if (document.audio && !TTSToPlay) {
        SoundPlayer.loadUrl(document.audio)
      } else {
        // @ts-expect-error ios params should be optional
        Tts.speak(TTSToPlay, {
          androidParams: {
            KEY_PARAM_PAN: 0,
            KEY_PARAM_VOLUME: 0.5,
            KEY_PARAM_STREAM: 'STREAM_MUSIC'
          }
        })
      }
    }
  }

  return (
    <StyledView>
      <VolumeIcon disabled={disabled || !isInitialized} isActive={isActive} onPress={handleSpeakerClick}>
        <VolumeUp />
      </VolumeIcon>
    </StyledView>
  )
}

export default AudioPlayer
