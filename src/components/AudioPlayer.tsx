import React, { ReactElement, useCallback, useState } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import SoundPlayer from 'react-native-sound-player'
import Tts, { TtsError } from 'react-native-tts'
import styled from 'styled-components/native'

import { VolumeUpCircleIcon } from '../../assets/images'
import { Document } from '../constants/endpoints'
import { stringifyDocument } from '../services/helpers'

export interface AudioPlayerProps {
  document: Document
  disabled: boolean
  // If the user submitted a correct alternative (differing enough to the document), we want to play the alternative
  submittedAlternative?: string | null
}

const StyledView = styled.View`
  align-items: center;
  margin-bottom: ${props => props.theme.spacings.sm};
`

const VolumeIcon = styled.TouchableOpacity<{ disabled: boolean; isActive: boolean }>`
  position: absolute;
  top: ${wp('-4.5%')}px;
  width: ${wp('9%')}px;
  height: ${wp('9%')}px;
  border-radius: 50px;
  background-color: ${props => {
    if (props.disabled) {
      return props.theme.colors.lunesBlackUltralight
    }
    if (props.isActive) {
      return props.theme.colors.lunesRed
    }
    return props.theme.colors.lunesRedDark
  }};
  justify-content: center;
  align-items: center;
  shadow-color: ${props => props.theme.colors.shadow};
  elevation: 8;
  shadow-radius: 5px;
  shadow-offset: 1px 1px;
  shadow-opacity: 0.5;
`

const AudioPlayer = ({ document, disabled, submittedAlternative }: AudioPlayerProps): ReactElement => {
  const { audio } = document
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
        console.error(`Tts-Error: ${error.code}`)
        if (error.code === 'no_engine') {
          await Tts.requestInstallEngine().catch(e => console.error('Failed to install tts engine: ', e))
        }
      })
  }, [])

  React.useEffect(() => {
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
        Tts.speak(submittedAlternative ?? stringifyDocument(document), {
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
      <VolumeIcon
        disabled={disabled || !isInitialized}
        isActive={isActive}
        onPress={handleSpeakerClick}
        accessibilityRole='button'>
        <VolumeUpCircleIcon width={wp('8%')} height={wp('8%')} />
      </VolumeIcon>
    </StyledView>
  )
}

export default AudioPlayer
