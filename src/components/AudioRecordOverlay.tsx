import React, { ReactElement, useMemo, useState } from 'react'
import { Modal as RNModal, Pressable } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled, { useTheme } from 'styled-components/native'

import { CloseIcon, FloppyDiskIcon, MicrophoneIcon, PlayIcon, StopIcon } from '../../assets/images'
import { getLabels } from '../services/helpers'
import { log } from '../services/sentry'
import { HeadingText } from './text/Heading'

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
    props.isPressed ? props.theme.colors.audioRecordingActive : props.theme.colors.background};
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
  background-color: ${props => props.theme.colors.progressIndicator};
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
  onStartRecord: () => Promise<void>
  onStopRecord: () => Promise<void>
  onStartPlay: () => Promise<void>
  onStopPlay: () => Promise<void>
  onSaveRecord: () => void
  recordTime: string
  meteringResults: number[]
  isPlayingAudio: boolean
}

// Zero alignment of values with the minimum metering value
const cleanUpMeteringResults = (meteringResults: number[]): number[] => {
  const filteredResults = meteringResults.filter(el => el !== Math.min(...meteringResults))
  return filteredResults.map(el => el + Math.abs(Math.min(...filteredResults)))
}

const AudioRecordOverlay = ({
  onClose,
  onStartRecord,
  onStopRecord,
  onStartPlay,
  onStopPlay,
  onSaveRecord,
  recordTime,
  meteringResults,
  isPlayingAudio,
}: AudioRecordOverlayProps): ReactElement => {
  const [isPressed, setIsPressed] = useState<boolean>(false)
  const { hold, talk } = getLabels().general.audio
  const theme = useTheme()

  const cleanedMetering = useMemo(() => cleanUpMeteringResults(meteringResults), [meteringResults])

  return (
    <RNModal visible transparent animationType='fade' onRequestClose={() => onClose()}>
      <Container>
        <IconContainer>
          {meteringResults.length > 0 && !isPressed && (
            <>
              {isPlayingAudio ? (
                <Icon onPress={() => onStopPlay()}>
                  <StopIcon width={hp('3.5%')} height={hp('3.5%')} />
                </Icon>
              ) : (
                <Icon onPress={() => onStartPlay()}>
                  <PlayIcon width={hp('3.5%')} height={hp('3.5%')} />
                </Icon>
              )}
              <Icon onPress={() => onSaveRecord()}>
                <FloppyDiskIcon width={hp('3.5%')} height={hp('3.5%')} />
              </Icon>
            </>
          )}
          <Icon onPress={() => onClose()}>
            <CloseIcon width={hp('3.5%')} height={hp('3.5%')} />
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
            <RecordingInfo>{recordTime.slice(1, recordTime.length)}</RecordingInfo>
          </InfoContainer>
          <RecordIcon
            onPressIn={() => {
              setIsPressed(true)
              onStartRecord().catch(e => log(e))
            }}
            onPressOut={() => {
              setIsPressed(false)
              onStopRecord().catch(e => log(e))
            }}
            isPressed={isPressed}>
            <MicrophoneIcon width={theme.spacingsPlain.xl} height={theme.spacingsPlain.xl} />
          </RecordIcon>
        </Content>
      </Container>
    </RNModal>
  )
}

export default AudioRecordOverlay
