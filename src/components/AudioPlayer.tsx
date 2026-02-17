import React, { ReactElement, useEffect, useState } from 'react'
import { ToastAndroid } from 'react-native'
import { Tooltip } from 'react-native-paper'
import SoundPlayer from 'react-native-sound-player'
import Tts, { Options } from 'react-native-tts'
import styled, { useTheme } from 'styled-components/native'

import { VolumeDisabled, VolumeUpCircleIcon } from '../../assets/images'
import useTtsState from '../hooks/useTtsState'
import { useIsSilent } from '../hooks/useVolumeState'
import { getLabels } from '../services/helpers'
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

const Icon = (): ReactElement => {
  const theme = useTheme()
  const isSilent = useIsSilent()

  if (isSilent) {
    return (
      <Tooltip enterTouchDelay={0} title={getLabels().general.error.deviceIsMuted} leaveTouchDelay={2600}>
        <VolumeDisabled width={theme.spacingsPlain.md} height={theme.spacingsPlain.md} />
      </Tooltip>
    )
  }

  return <VolumeUpCircleIcon width={theme.spacingsPlain.lg} height={theme.spacingsPlain.lg} />
}

type AudioPlayerProps = {
  disabled: boolean
  audio: string
  isTtsText?: boolean
}

const AudioPlayer = ({ audio, disabled, isTtsText = false }: AudioPlayerProps): ReactElement => {
  const ttsInitialized = useTtsState() === 'initialized'
  const [soundPlayerInitialized, setSoundPlayerInitialized] = useState<boolean>(false)
  const [isActive, setIsActive] = useState(false)
  const isSilent = useIsSilent()

  useEffect(() => {
    if (disabled) {
      return () => undefined
    }
    if (isTtsText) {
      return Tts.addListener('tts-finish', () => setIsActive(false)).remove
    }

    const onFinishedLoadingSubscription = SoundPlayer.addEventListener('FinishedLoadingURL', () => {
      SoundPlayer.play()
    })
    const onSoundPlayerFinishPlaying = SoundPlayer.addEventListener('FinishedPlaying', () => setIsActive(false))
    setSoundPlayerInitialized(true)

    return () => {
      onFinishedLoadingSubscription.remove()
      onSoundPlayerFinishPlaying.remove()
    }
  }, [disabled, isTtsText, audio])

  const handleSpeakerClick = (): void => {
    if (isTtsText) {
      if (ttsInitialized) {
        setIsActive(true)
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
        Tts.requestInstallEngine().catch(() => {
          /* eslint-disable-next-line no-console */
          console.error('Could not install tts engine')
          ToastAndroid.show(getLabels().general.audio.noTtsEngine, ToastAndroid.SHORT)
        })
      }
    } else if (soundPlayerInitialized) {
      setIsActive(true)
      SoundPlayer.loadUrl(audio)
    }
  }

  return (
    <VolumeIcon
      disabled={disabled || (!isTtsText && !soundPlayerInitialized) || isSilent}
      isActive={isActive}
      onPress={handleSpeakerClick}
      testID='audio-player'
    >
      <Icon />
    </VolumeIcon>
  )
}

export default AudioPlayer
