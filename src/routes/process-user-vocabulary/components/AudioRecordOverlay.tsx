import React, { Dispatch, ReactElement, SetStateAction, useMemo, useState } from 'react'
import { Modal as RNModal, Platform, Pressable } from 'react-native'
import { PERMISSIONS } from 'react-native-permissions'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import uuid from 'react-native-uuid'
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

interface AudioRecordOverlayProps {
  onClose: () => void
  onStartRecording: () => Promise<void>
  onStopRecording: () => Promise<void>
  recordingTime: string
  meteringResults: number[]
  setShowAudioRecordOverlay: Dispatch<SetStateAction<boolean>>
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
  recordingTime,
  meteringResults,
  setShowAudioRecordOverlay,
}: AudioRecordOverlayProps): ReactElement => {
  const [isPressed, setIsPressed] = useState<boolean>(false)
  const { permissionGranted, permissionRequested } = useGrantPermissions(
    Platform.OS === 'android' ? PERMISSIONS.ANDROID.RECORD_AUDIO : PERMISSIONS.IOS.MICROPHONE
  )
  const { hold, talk } = getLabels().general.audio
  const { description } = getLabels().general.audio.noAuthorization
  const theme = useTheme()

  const cleanedMetering = useMemo(() => cleanUpMeteringResults(meteringResults), [meteringResults])

  return (
    <>
      {permissionGranted && (
        <RNModal visible transparent animationType='fade' onRequestClose={() => onClose()}>
          <Container>
            <Icon onPress={() => onClose()}>
              <CloseIcon width={theme.spacingsPlain.lg} height={theme.spacingsPlain.lg} />
            </Icon>
            <Content>
              <HeadingContainer>
                <Heading>{isPressed ? talk : hold}</Heading>
              </HeadingContainer>
              <InfoContainer>
                <MeteringInfo>
                  {cleanedMetering.map(element => (
                    <MeteringBar key={uuid.v4().toString()} height={element} />
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
                onPressOut={() =>
                  onStopRecording()
                    .catch(reportError)
                    .finally(() => setIsPressed(false))
                }
                isPressed={isPressed}
                testID='record-audio-button'>
                <MicrophoneIcon width={theme.spacingsPlain.xxl} height={theme.spacingsPlain.xxl} />
              </RecordIcon>
            </Content>
          </Container>
        </RNModal>
      )}
      {permissionRequested && !permissionGranted && (
        <NotAuthorisedView setVisible={setShowAudioRecordOverlay} description={description} />
      )}
    </>
  )
}

export default AudioRecordOverlay
