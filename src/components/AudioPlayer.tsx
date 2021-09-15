import React, { ReactElement, useState } from 'react'
import SoundPlayer from 'react-native-sound-player'
import Tts, { TtsError } from 'react-native-tts'
import { COLORS } from '../constants/theme/colors'
import { VolumeUp } from '../../assets/images'
import { DocumentType } from '../constants/endpoints'
import styled from 'styled-components/native'

const StyledView = styled.View`
  align-items: center;
  margin-bottom: 20px;
`

const VolumeIcon = styled.TouchableOpacity`
  position: absolute;
  top: -20px;
  left: 45%;
  width: 40px;
  height: 40px;
  border-radius: 50px;
  background-color: ${props => props.theme.colors.lunesFunctionalIncorrectDark};
  justify-content: center;
  align-items: center;
  shadow-color: ${props => props.theme.colors.shadow};
  elevation: 8;
  shadow-radius: 5px;
  shadow-offset: 1px 1px;
  shadow-opacity: 0.5;
`

const VolumeUpIcon = styled(VolumeUp)<{ disabled: boolean; isActive: boolean }>`
  color: ${props =>
    props.disabled
      ? props.theme.colors.lunesBlackUltralight
      : props.isActive
      ? props.theme.colors.lunesRed
      : props.theme.colors.lunesRedDark};
`

export interface AudioPlayerProps {
  document: DocumentType
  disabled: boolean
}

const AudioPlayer = (props: AudioPlayerProps): ReactElement => {
  const { document, disabled } = props
  const [isInitialized, setIsInitialized] = useState(false)
  const [ttsError, setTtsError] = useState<TtsError | null>(null)
  const [isActive, setIsActive] = useState(false)

  React.useEffect(() => {
    if (ttsError?.code === 'no_engine') {
      return
    }
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
          await Tts.requestInstallEngine().catch(() => setTtsError(error))
        }
      })
  }, [isInitialized, ttsError])

  React.useEffect(() => {
    if (isInitialized) {
      const _onSoundPlayerFinishPlaying = SoundPlayer.addEventListener('FinishedPlaying', () => setIsActive(false))
      const ttsHandler = (): void => setIsActive(false)
      Tts.addEventListener('tts-finish', ttsHandler)

      return () => {
        _onSoundPlayerFinishPlaying.remove()
        Tts.removeEventListener('tts-finish', ttsHandler)
      }
    }
  }, [isActive, isInitialized])

  const handleSpeakerClick = (audio?: string): void => {
    if (isInitialized) {
      setIsActive(true)
      if (audio) {
        SoundPlayer.playUrl(document?.audio)
      } else {
        // @ts-expect-error ios params should be optional
        Tts.speak(`${document?.article.value} ${document?.word}`, {
          androidParams: {
            KEY_PARAM_PAN: -1,
            KEY_PARAM_VOLUME: 0.5,
            KEY_PARAM_STREAM: 'STREAM_MUSIC'
          }
        })
      }
    }
  }

  return (
    <StyledView>
      <VolumeIcon disabled={disabled} onPress={() => handleSpeakerClick(document?.audio)}>
      <VolumeUpIcon disabled={disabled} isActive={isActive} />
      </VolumeIcon>
    </StyledView>
  )
}

export default AudioPlayer