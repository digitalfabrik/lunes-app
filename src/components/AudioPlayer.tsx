import React, { useState } from 'react'
// @ts-expect-error
import SoundPlayer from 'react-native-sound-player'
// @ts-expect-error
import Tts from 'react-native-tts'
import { COLORS } from '../constants/colors'
import { VolumeUp } from '../../assets/images'
import { DocumentType } from '../constants/endpoints'
import styled from 'styled-components/native'

export interface AudioPlayerProps {
  document: DocumentType
  disabled: boolean
}

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
  background-color: ${COLORS.lunesFunctionalIncorrectDark};
  justify-content: center;
  align-items: center;
  shadowColor: ${COLORS.shadow};
  elevation: 8;
  shadowRadius: 5px;
  shadowOffset: { width: 1, height: 1 };
  shadowOpacity: 0.5;
`

function AudioPlayer(props: AudioPlayerProps) {
  Tts.setDefaultLanguage('de-DE')

  const { document, disabled } = props
  const [isActive, setIsActive] = useState(false)

  React.useEffect(() => {
    const _onSoundPlayerFinishPlaying = SoundPlayer.addEventListener('FinishedPlaying', () => setIsActive(false))

    const _onTtsFinishPlaying = Tts.addEventListener('tts-finish', () => setIsActive(false))

    return () => {
      _onSoundPlayerFinishPlaying.remove()
      _onTtsFinishPlaying.remove()
    }
  }, [])

  const handleSpeakerClick = (audio?: string): void => {
    setIsActive(true)
    if (audio) {
      SoundPlayer.playUrl(document?.audio)
    } else {
      Tts.speak(`${document?.article.value} ${document?.word}`, {
        androidParams: {
          KEY_PARAM_PAN: -1,
          KEY_PARAM_VOLUME: 0.5,
          KEY_PARAM_STREAM: 'STREAM_MUSIC'
        }
      })
    }
  }

  return (
    <StyledView>
      <VolumeIcon testID='volume-button' disabled={disabled} onPress={() => handleSpeakerClick(document?.audio)}>
        <VolumeUp fill={disabled ? COLORS.lunesBlackUltralight : isActive ? COLORS.lunesRed : COLORS.lunesRedDark} />
      </VolumeIcon>
    </StyledView>
  )
}

export default AudioPlayer
