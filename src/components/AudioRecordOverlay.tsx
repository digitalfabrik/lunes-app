import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { Modal as RNModal, Platform, Pressable } from 'react-native'
import { PERMISSIONS, request, requestMultiple, RESULTS } from 'react-native-permissions'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled, { useTheme } from 'styled-components/native'

import { CloseIcon, FloppyDiskIcon, MicrophoneIcon, PlayIcon, StopIcon } from '../../assets/images'
import { getLabels } from '../services/helpers'
import { reportError } from '../services/sentry'
import { HeadingText } from './text/Heading'

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.colors.backgroundAccent};
`

const Icon = styled.Pressable`
  align-self: flex-end;
  margin: ${props => `${props.theme.spacings.xs} ${props.theme.spacings.md}`};
  align-self: center;
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
  min-height: ${props => props.theme.spacings.xxs}
  height: ${props => `${props.height * 2}`}px;
  width: ${props => props.theme.spacings.xxs}
  background-color: ${props => props.theme.colors.audioRecordingActive};
  border-radius-: 50px;
  align-self: center;
  margin: 0 1px;
`

const InfoContainer = styled.View`
  justify-content: flex-end;
`

const IconContainer = styled.View`
  justify-content: flex-end;
  flex-direction: row;
`

interface AudioRecordOverlayProps {
  onClose: () => void
  onStartRecording: () => Promise<void>
  onStopRecording: () => Promise<void>
  onStartPlay: () => Promise<void>
  onStopPlay: () => Promise<void>
  onSaveRecording: () => void
  recordingTime: string
  meteringResults: number[]
  isPlaying: boolean
  isRecording: boolean
}

// Zero alignment of values with the minimum metering value
const cleanUpMeteringResults = (meteringResults: number[]): number[] => {
  const filteredResults = meteringResults.filter(el => el !== Math.min(...meteringResults))
  return filteredResults.map(el => el + Math.abs(Math.min(...filteredResults)))
}

const AudioRecordOverlay = ({
  onClose,
  onStartRecording,
  onStopRecording,
  onStartPlay,
  onStopPlay,
  onSaveRecording,
  recordingTime,
  meteringResults,
  isPlaying,
  isRecording,
}: AudioRecordOverlayProps): ReactElement => {
  const [isPressed, setIsPressed] = useState<boolean>(false)
  const [permissionRequested, setPermissionRequested] = useState<boolean>(false)
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false)
  const { hold, talk } = getLabels().general.audio
  const theme = useTheme()

  const requestAndroidPermissions = useCallback(() => {
    requestMultiple([
      PERMISSIONS.ANDROID.RECORD_AUDIO,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    ])
      .then(result => {
        const grants = Object.values(result)
        setPermissionGranted(grants.filter((el, i) => grants.indexOf(el) === i).toString() === RESULTS.GRANTED)
      })
      .catch(reportError)
      .finally(() => setPermissionRequested(true))
  }, [])

  const requestIosPermission = useCallback(() => {
    request(PERMISSIONS.IOS.MICROPHONE)
      .then(result => setPermissionGranted(result === RESULTS.GRANTED))
      .catch(reportError)
      .finally(() => setPermissionRequested(true))
  }, [])

  useEffect(() => {
    if (!permissionRequested) {
      if (Platform.OS === 'android') {
        requestAndroidPermissions()
      } else {
        requestIosPermission()
      }
    }
  }, [permissionRequested, requestIosPermission, requestAndroidPermissions])

  const cleanedMetering = useMemo(() => cleanUpMeteringResults(meteringResults), [meteringResults])

  return (
    <RNModal visible transparent animationType='fade' onRequestClose={() => onClose()}>
      <Container>
        <IconContainer>
          {!isRecording && meteringResults.length > 0 && (
            <>
              {isPlaying ? (
                <Icon onPress={() => onStopPlay()}>
                  <StopIcon width={hp('3.5%')} height={hp('3.5%')} />
                </Icon>
              ) : (
                <Icon onPress={() => onStartPlay()}>
                  <PlayIcon width={hp('3.5%')} height={hp('3.5%')} />
                </Icon>
              )}
              <Icon onPress={() => onSaveRecording()}>
                <FloppyDiskIcon width={hp('3.5%')} height={hp('3.5%')} />
              </Icon>
            </>
          )}
          <Icon onPress={() => onClose()}>
            <CloseIcon width={theme.spacingsPlain.lg} height={theme.spacingsPlain.lg} />
          </Icon>
        </IconContainer>
        <Content>
          <HeadingContainer>
            <Heading>{isPressed ? talk : hold}</Heading>
          </HeadingContainer>
          <InfoContainer>
            <MeteringInfo>
              {cleanedMetering.map((element, index) => (
                // eslint-disable-next-line react/no-array-index-key -- no better key available
                <MeteringBar key={index} height={element} />
              ))}
            </MeteringInfo>
            <RecordingInfo>{recordingTime.slice(1, recordingTime.length)}</RecordingInfo>
          </InfoContainer>
          {permissionGranted && (
            <RecordIcon
              onPressIn={() =>
                onStartRecording()
                  .catch(reportError)
                  .finally(() => setIsPressed(true))
              }
              onPressOut={() =>
                onStopRecording()
                  .catch(reportError)
                  .finally(() => setIsPressed(false))
              }
              isPressed={isPressed}>
              <MicrophoneIcon width={theme.spacingsPlain.xxl} height={theme.spacingsPlain.xxl} />
            </RecordIcon>
          )}
        </Content>
      </Container>
    </RNModal>
  )
}

export default AudioRecordOverlay
