import React, { ReactElement, useState } from 'react'
import { Modal as RNModal, Pressable} from 'react-native'
import AudioRecorderPlayer from 'react-native-audio-recorder-player/index'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled, { useTheme } from 'styled-components/native'

import { CloseIcon, MicrophoneIcon } from '../../assets/images'
import { getLabels } from '../services/helpers'
import { log } from '../services/sentry'
import { HeadingText } from './text/Heading'

interface AudioRecordOverlayProps {
  setVisible: (visible: boolean) => void
}

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.colors.backgroundAccent};
`

const Icon = styled.Pressable`
  align-self: flex-end;
  margin: ${props => `${props.theme.spacings.xs} ${props.theme.spacings.sm}`};
`

const RecordIcon = styled.View`
  width: ${hp('9%')}px;
  height: ${hp('9%')}px;
  align-self: center;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  background-color: ${props => props.theme.colors.disabled};
`

const RecordIconContainer = styled(Pressable)<{ isPressed: boolean }>`
  width: ${hp('12%')}px;
  height: ${hp('12%')}px;
  align-self: center;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  background-color: ${props => (props.isPressed ? props.theme.colors.correct : props.theme.colors.background)};
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
  height: ${props => `${props.height}`}px;
  width: ${props => props.theme.spacings.xxs}
  background-color: ${props => props.theme.colors.progressIndicator};
  border-radius-: 50px;
  align-self: center;
  margin: 0 1px;
`

const InfoContainer = styled.View`
justify-content: flex-end
`

const accuracy = 0.1
const factor = 1000
const audioRecorderPlayer = new AudioRecorderPlayer()
audioRecorderPlayer.setSubscriptionDuration(accuracy).catch(e => e)

const AudioRecordOverlay = ({ setVisible }: AudioRecordOverlayProps): ReactElement => {
  const [isPressed, setIsPressed] = useState<boolean>(false)
  const [recordSecs, setRecordSecs] = useState<number>(0)
  const [metering, setMetering] = useState<number[]>([])
  const [recordTime, setRecordTime] = useState<string>('00:00')
  const { hold, talk } = getLabels().general.audio
  const theme = useTheme()

  const meteringResults = metering.map(el => el + Math.abs(Math.min(...metering)))

  const onStartRecord = async () => {
    setMetering([])
    const result = await audioRecorderPlayer.startRecorder(undefined, undefined, true)
    audioRecorderPlayer.addRecordBackListener(e => {
      setMetering(metering => [...metering, Math.floor(e.currentMetering ?? 0)])
      setRecordTime(audioRecorderPlayer.mmss(Math.floor(e.currentPosition / factor)))
    })
    // eslint-disable-next-line no-console
    console.log(result)
  }

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder()
    audioRecorderPlayer.removeRecordBackListener()
    setRecordSecs(0)
    // eslint-disable-next-line no-console
    console.log(result)
  }

  return (
    <RNModal visible transparent animationType='fade' onRequestClose={() => setVisible(false)}>
      <Container>
        <Icon onPress={() => setVisible(false)}>
          <CloseIcon width={hp('3.5%')} height={hp('3.5%')} />
        </Icon>
        <Content>
          <Heading>{isPressed ? talk : hold}</Heading>
          <InfoContainer>

          <MeteringInfo>
            {meteringResults.map((element, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <MeteringBar key={index} height={element*1.5} />
            ))}
          </MeteringInfo>
          <RecordingInfo>{recordTime.slice(1, recordTime.length)}</RecordingInfo>
          </InfoContainer>
          <RecordIconContainer
            onPressIn={() => {
              setIsPressed(true)
              onStartRecord().catch(e => log(e))
            }}
            onPressOut={() => {
              setIsPressed(false)
              onStopRecord().catch(e => log(e))
            }}
            isPressed={isPressed}>
            <RecordIcon>
              <MicrophoneIcon width={theme.spacingsPlain.xl} height={theme.spacingsPlain.xl} />
            </RecordIcon>
          </RecordIconContainer>
        </Content>
      </Container>
    </RNModal>
  )
}

export default AudioRecordOverlay
