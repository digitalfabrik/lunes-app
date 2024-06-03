import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import { Modal as RNModal, Platform, Pressable } from 'react-native'
import AudioRecorderPlayer from 'react-native-audio-recorder-player'
import { PERMISSIONS } from 'react-native-permissions'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled, { useTheme } from 'styled-components/native'

import { CloseIcon, MicrophoneIcon } from '../../../../assets/images'
import NotAuthorisedView from '../../../components/NotAuthorisedView'
import { HeadingText } from '../../../components/text/Heading'
import useGrantPermissions from '../../../hooks/useGrantPermissions'
import { getLabels } from '../../../services/helpers'
import { reportError } from '../../../services/sentry'

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.colors.backgroundAccent};
`

const Icon = styled.Pressable`
  align-self: flex-end;
  margin: ${props => `${props.theme.spacings.xs} ${props.theme.spacings.md}`};
`

const RecordIcon = styled(Pressable)<{ isPressed: boolean }>`
  width: ${hp('12%')}px;
  height: ${hp('12%')}px;
  align-self: center;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  background-color: ${props =>
    props.isPressed ? props.theme.colors.audioRecordingActive : props.theme.colors.disabled};
`

const Content = styled.View`
  margin-top: ${hp('12%')}px;
  margin-bottom: ${hp('6%')}px;
  flex: 1;
  justify-content: space-between;
`

const Heading = styled(HeadingText)`
  text-align: center;
  font-size: ${props => props.theme.spacings.lg};
`

const HeadingContainer = styled.View`
  min-height: ${hp('12%')}px;
`

const RecordingInfo = styled.Text`
  font-size: ${props => props.theme.spacings.lg};
  text-align: center;
`

const MeteringInfo = styled.View`
  flex-direction: row;
  align-self: center;
  min-height: ${hp('12%')}px;
`

const MeteringBar = styled.View<{ height: number }>`
  min-height: ${props => props.theme.spacings.xxs};
  height: ${props => `${props.height * 2}`}px;
  width: ${props => props.theme.spacings.xxs};
  background-color: ${props => props.theme.colors.audioRecordingActive};
  border-radius: 50px;
  align-self: center;
  margin: 0 1px;
`

const InfoContainer = styled.View`
  justify-content: flex-end;
`

type AudioRecordOverlayProps = {
  onClose: () => void
  onAudioRecorded: (recordingPath: string) => void
  setShowAudioRecordOverlay: (showAudioRecordOverlay: boolean) => void
  recordingPath: string | null
}

const recordingTimeInit = '00:00'
const factor = 1000
// Power recording levels for metering differ between android and ios
// https://github.com/ziscloud/sound_recorder/blob/46544fc23b71e6f929b372fad0313c70b0301371/android/src/main/java/com/neuronbit/sound_recorder/SoundRecorderPlugin.java#L375
const androidFactor = 0.25
const maxRecordingTime = 5000

// Zero alignment of values with the minimum metering value
const cleanUpMeteringResults = (meteringResults: number[]): number[] =>
  meteringResults
    .filter(el => el !== Math.min(...meteringResults))
    .map((el, _, filteredResults) => el + Math.abs(Math.min(...filteredResults)))

const getCurrentMetering = (metering = 0): number => (Platform.OS === 'android' ? metering * androidFactor : metering)

const accuracy = 0.1
const audioRecorderPlayer = new AudioRecorderPlayer()
audioRecorderPlayer.setSubscriptionDuration(accuracy).catch(reportError)

const AudioRecordOverlay = ({
  onClose,
  setShowAudioRecordOverlay,
  onAudioRecorded,
  recordingPath,
}: AudioRecordOverlayProps): ReactElement => {
  const [meteringResults, setMeteringResults] = useState<number[]>([])
  const [recordingTime, setRecordingTime] = useState<string>(recordingTimeInit)
  const [isPressed, setIsPressed] = useState<boolean>(false)
  const { permissionGranted, permissionRequested } = useGrantPermissions(
    Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO,
  )
  const { hold, talk } = getLabels().general.audio
  const { description } = getLabels().general.audio.noAuthorization
  const theme = useTheme()

  useEffect(() => {
    if (!recordingPath) {
      setMeteringResults([])
    }
  }, [recordingPath])

  const cleanedMetering = useMemo(() => cleanUpMeteringResults(meteringResults), [meteringResults])

  const onStopRecording = async (): Promise<void> => {
    try {
      onAudioRecorded(await audioRecorderPlayer.stopRecorder())
      audioRecorderPlayer.removeRecordBackListener()
      setShowAudioRecordOverlay(false)
    } catch (e) {
      // If the recording is stopped to fast, sometimes an error is thrown which can be ignored.
      // https://github.com/hyochan/react-native-audio-recorder-player/issues/490
      if (e instanceof Error && e.message !== 'stop failed.') {
        reportError(e)
      }
    } finally {
      setIsPressed(false)
    }
  }

  const onStartRecording = async (): Promise<void> => {
    setMeteringResults([])
    await audioRecorderPlayer.startRecorder(undefined, undefined, true)
    audioRecorderPlayer.addRecordBackListener(async e => {
      setMeteringResults(oldMeteringResults => [
        ...oldMeteringResults,
        Math.floor(getCurrentMetering(e.currentMetering)),
      ])
      setRecordingTime(audioRecorderPlayer.mmss(Math.floor(e.currentPosition / factor)))
      if (e.currentPosition > maxRecordingTime) {
        await onStopRecording()
      }
    })
  }

  return (
    <RNModal visible transparent animationType='fade' onRequestClose={onClose}>
      <Container>
        <Icon onPress={onClose}>
          <CloseIcon width={theme.spacingsPlain.lg} height={theme.spacingsPlain.lg} />
        </Icon>
        <>
          {permissionGranted && (
            <Content>
              <HeadingContainer>
                <Heading>{isPressed ? talk : hold}</Heading>
              </HeadingContainer>
              <InfoContainer>
                <MeteringInfo>
                  {cleanedMetering.map((element, index) => (
                    // eslint-disable-next-line react/no-array-index-key -- no better key available and order of items doesn't change
                    <MeteringBar key={index} height={element} />
                  ))}
                </MeteringInfo>
                <RecordingInfo>{recordingTime.slice(1, recordingTime.length)}</RecordingInfo>
              </InfoContainer>
              <RecordIcon
                onPressIn={() =>
                  onStartRecording()
                    .catch(reportError)
                    .finally(() => setIsPressed(true))
                }
                onPressOut={onStopRecording}
                isPressed={isPressed}
                testID='record-audio-button'>
                <MicrophoneIcon width={theme.spacingsPlain.xxl} height={theme.spacingsPlain.xxl} />
              </RecordIcon>
            </Content>
          )}
        </>
        {permissionRequested && !permissionGranted && (
          <NotAuthorisedView description={description} setVisible={setShowAudioRecordOverlay} />
        )}
      </Container>
    </RNModal>
  )
}

export default AudioRecordOverlay
