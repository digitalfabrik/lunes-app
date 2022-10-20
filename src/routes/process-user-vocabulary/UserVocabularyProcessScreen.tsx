import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { Animated, Platform } from 'react-native'
import AudioRecorderPlayer from 'react-native-audio-recorder-player'
import { DocumentDirectoryPath, writeFile } from 'react-native-fs'
import styled, { useTheme } from 'styled-components/native'

import {
  CloseCircleIconBlue,
  ImageCircleIcon,
  MicrophoneCircleIcon,
  VolumeUpCircleOutlineIcon,
} from '../../../assets/images'
import AudioRecordOverlay from '../../components/AudioRecordOverlay'
import Button from '../../components/Button'
import CustomTextInput from '../../components/CustomTextInput'
import Dropdown from '../../components/Dropdown'
import RouteWrapper from '../../components/RouteWrapper'
import { TitleWithSpacing } from '../../components/Title'
import { ContentError } from '../../components/text/Content'
import { HintText } from '../../components/text/Hint'
import { Subheading } from '../../components/text/Subheading'
import { ARTICLES, BUTTONS_THEME, getArticleWithLabel } from '../../constants/data'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { addUserDocument, getNextUserVocabularyId, incrementNextUserVocabularyId } from '../../services/AsyncStorage'
import { getLabels } from '../../services/helpers'
import { reportError } from '../../services/sentry'
import ImageSelectionOverlay from './components/ImageSelectionOverlay'
import Thumbnail from './components/Thumbnail'

const Root = styled.ScrollView`
  padding: ${props => props.theme.spacings.md};
  flex: 1;
`

const SaveButton = styled(Button)`
  margin: ${props => props.theme.spacings.lg} 0;
  align-self: center;
`

const AddAudioButton = styled(Button)`
  margin-top: ${props => props.theme.spacings.md};
  justify-content: flex-start;
  padding: 0;
`

const AddImageButton = styled(AddAudioButton)`
  margin-bottom: 0;
  margin-top: ${props => props.theme.spacings.sm};
`

const StyledHintText = styled(HintText)`
  margin-left: ${props => props.theme.spacings.xxl};
`

const ThumbnailContainer = styled.View`
  flex-direction: row;
`

const AudioContainer = styled(Animated.View)`
  margin: ${props => props.theme.spacings.md} 0;
  justify-content: flex-start;
  padding: 0;
  flex-direction: row;
`

const DeleteContainer = styled.Pressable`
  align-self: center;
  justify-content: center;
  align-items: center;
  margin: ${props => `${props.theme.spacings.xs} ${props.theme.spacings.md}`};
`

const PlayContainer = styled.Pressable`
  align-self: center;
  justify-content: center;
  align-items: center;
`

const AudioText = styled(Subheading)`
  align-self: center;
`

interface UserVocabularyProcessScreenProps {
  navigation: StackNavigationProp<RoutesParams, 'UserVocabularyProcess'>
}

const accuracy = 0.1
const factor = 1000
const recordingTimeInit = '00:00'
// The recording library does align the android power recording level to ios for metering as it's done in different libraries https://github.com/ziscloud/sound_recorder/blob/46544fc23b71e6f929b372fad0313c70b0301371/android/src/main/java/com/neuronbit/sound_recorder/SoundRecorderPlugin.java#L375
const androidFactor = 0.25

const audioRecorderPlayer = new AudioRecorderPlayer()
audioRecorderPlayer.setSubscriptionDuration(accuracy).catch(e => e)

const getCurrentMetering = (metering?: number): number => {
  if (!metering) {
    return 0
  }
  return Platform.select({
    ios: metering,
    android: metering * androidFactor,
  }) as number
}

const UserVocabularyProcessScreen = ({ navigation }: UserVocabularyProcessScreenProps): ReactElement => {
  const [images, setImages] = useState<string[]>([])
  const [word, setWord] = useState<string>('')
  const [articleId, setArticleId] = useState<number | null>(null)
  const [hasWordErrorMessage, setHasWordErrorMessage] = useState<boolean>(false)
  const [hasArticleErrorMessage, setHasArticleErrorMessage] = useState<boolean>(false)
  const [hasImageErrorMessage, setHasImageErrorMessage] = useState<boolean>(false)
  const [showImageSelectionOverlay, setShowImageSelectionOverlay] = useState<boolean>(false)
  const [showAudioRecordOverlay, setShowAudioRecordOverlay] = useState<boolean>(false)
  const [meteringResults, setMeteringResults] = useState<number[]>([])
  const [recordingTime, setRecordingTime] = useState<string>(recordingTimeInit)
  const [recordingPath, setRecordingPath] = useState<string | null>(null)

  const {
    headline,
    addImage,
    addAudio,
    wordPlaceholder,
    articlePlaceholder,
    errorMessage,
    saveButton,
    maxPictureUpload,
    requiredFields,
  } = getLabels().userVocabulary.creation
  const theme = useTheme()

  const fadeAnim = useRef(new Animated.Value(0)).current

  const fadeIn = useCallback(() => {
    Animated.timing(fadeAnim, {
      useNativeDriver: false,
      toValue: 1,
      duration: 4000,
    }).start()
  }, [fadeAnim])

  useEffect(() => {
    if (recordingPath) {
      fadeIn()
    }
  }, [fadeIn, recordingPath])

  const deleteRecording = (): void => {
    setRecordingPath(null)
    setMeteringResults([])
    setRecordingTime(recordingTimeInit)
  }
  const onSave = async (): Promise<void> => {
    const hasError = word.length === 0 || !articleId || images.length === 0

    if (hasError) {
      setHasWordErrorMessage(word.length === 0)
      setHasArticleErrorMessage(!articleId)
      setHasImageErrorMessage(images.length === 0 || images.length > 3)
      return
    }

    try {
      const id = await getNextUserVocabularyId()
      await incrementNextUserVocabularyId()

      const imagePaths = await Promise.all(
        images.map(async (image, index) => {
          const path = `${DocumentDirectoryPath}/image-${id}-${index}.txt`
          await writeFile(path, image, 'utf8')
          return { id: index, image: path }
        })
      )

      await addUserDocument({
        id,
        word,
        article: ARTICLES[articleId],
        document_image: imagePaths,
        audio: recordingPath ?? '',
        alternatives: [],
      })

      navigation.navigate('UserVocabularyList', { headerBackLabel: getLabels().general.back })

      setWord('')
      setArticleId(null)
      setImages([])
      deleteRecording()
    } catch (e) {
      reportError(e)
    }
  }

  const pushImage = (uri: string): void => setImages(old => [...old, uri])
  const deleteImage = (uri: string): void => setImages(images => images.filter(image => image !== uri))

  const onStartRecording = async (): Promise<void> => {
    setMeteringResults([])
    const id = await getNextUserVocabularyId()
    const filename = `audio-${id}`
    const path = Platform.select({
      ios: `${filename}.m4a`,
      android: `${DocumentDirectoryPath}/${filename}.mp3`,
    })
    const uri = await audioRecorderPlayer.startRecorder(path, undefined, true)
    audioRecorderPlayer.addRecordBackListener(e => {
      setMeteringResults(oldMeteringResults => [
        ...oldMeteringResults,
        Math.floor(getCurrentMetering(e.currentMetering)),
      ])
      setRecordingTime(audioRecorderPlayer.mmss(Math.floor(e.currentPosition / factor)))
    })
    setRecordingPath(uri)
  }

  const onStartPlay = async (): Promise<void> => {
    if (recordingPath) {
      await audioRecorderPlayer.startPlayer(recordingPath)
      audioRecorderPlayer.removePlayBackListener()
    }
  }

  const onStopRecording = async (): Promise<void> => {
    await audioRecorderPlayer.stopRecorder()
    audioRecorderPlayer.removeRecordBackListener()
    setShowAudioRecordOverlay(false)
  }

  const onCloseRecording = (): void => {
    setShowAudioRecordOverlay(false)
    deleteRecording()
  }

  if (showImageSelectionOverlay) {
    return <ImageSelectionOverlay setVisible={setShowImageSelectionOverlay} pushImage={pushImage} />
  }

  if (showAudioRecordOverlay) {
    return (
      <AudioRecordOverlay
        onClose={onCloseRecording}
        onStartRecording={onStartRecording}
        onStopRecording={onStopRecording}
        recordingTime={recordingTime}
        meteringResults={meteringResults}
      />
    )
  }

  // TODO add Keyboard handling for input fields LUN-424
  return (
    <RouteWrapper>
      <Root>
        <TitleWithSpacing title={headline} />
        <CustomTextInput
          clearable
          value={word}
          onChangeText={setWord}
          placeholder={wordPlaceholder}
          errorMessage={hasWordErrorMessage ? errorMessage : ''}
        />
        <Dropdown
          value={articleId}
          setValue={setArticleId}
          placeholder={articlePlaceholder}
          items={getArticleWithLabel()}
          itemKey='id'
          errorMessage={hasArticleErrorMessage ? errorMessage : ''}
        />
        <ThumbnailContainer>
          {images.map(item => (
            <Thumbnail key={item} image={item} deleteImage={() => deleteImage(item)} />
          ))}
        </ThumbnailContainer>
        <AddImageButton
          onPress={() => setShowImageSelectionOverlay(true)}
          disabled={images.length >= 3}
          label={addImage}
          buttonTheme={BUTTONS_THEME.text}
          iconLeft={ImageCircleIcon}
          iconSize={theme.spacingsPlain.xl}
        />
        <StyledHintText>{maxPictureUpload}</StyledHintText>
        {hasImageErrorMessage && <ContentError>{getLabels().userVocabulary.creation.imageErrorMessage}</ContentError>}
        {recordingPath ? (
          <AudioContainer style={{ opacity: fadeAnim }}>
            <>
              <AudioText>{recordingPath.substring(recordingPath.lastIndexOf('/') + 1).toUpperCase()}</AudioText>
              <DeleteContainer onPress={() => deleteRecording()} testID='delete-audio-recording'>
                <CloseCircleIconBlue width={theme.spacingsPlain.lg} height={theme.spacingsPlain.lg} />
              </DeleteContainer>
              <PlayContainer onPress={() => onStartPlay()}>
                <VolumeUpCircleOutlineIcon width={theme.spacingsPlain.lg} height={theme.spacingsPlain.lg} />
              </PlayContainer>
            </>
          </AudioContainer>
        ) : (
          <AddAudioButton
            onPress={() => setShowAudioRecordOverlay(true)}
            label={addAudio}
            buttonTheme={BUTTONS_THEME.text}
            iconLeft={MicrophoneCircleIcon}
            iconSize={theme.spacingsPlain.xl}
          />
        )}
        <HintText>{requiredFields}</HintText>
        <SaveButton onPress={onSave} label={saveButton} buttonTheme={BUTTONS_THEME.contained} />
      </Root>
    </RouteWrapper>
  )
}

export default UserVocabularyProcessScreen
