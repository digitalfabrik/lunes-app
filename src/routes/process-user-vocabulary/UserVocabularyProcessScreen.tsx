import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { Animated, Platform } from 'react-native'
import AudioRecorderPlayer from 'react-native-audio-recorder-player'
import { DocumentDirectoryPath, writeFile } from 'react-native-fs'
import styled, { useTheme } from 'styled-components/native'

import { CloseCircleIconBlue, ImageCircleIcon, MicrophoneCircleIcon, VolumeUpCircleIcon } from '../../../assets/images'
import Button from '../../components/Button'
import CustomTextInput from '../../components/CustomTextInput'
import Dropdown from '../../components/Dropdown'
import RouteWrapper from '../../components/RouteWrapper'
import { TitleWithSpacing } from '../../components/Title'
import { ContentError } from '../../components/text/Content'
import { HintText } from '../../components/text/Hint'
import { Subheading } from '../../components/text/Subheading'
import { ARTICLES, BUTTONS_THEME, VOCABULARY_ITEM_TYPES, getArticleWithLabel } from '../../constants/data'
import { RoutesParams } from '../../navigation/NavigationTypes'
import {
  addUserVocabularyItem,
  getNextUserVocabularyId,
  incrementNextUserVocabularyId,
} from '../../services/AsyncStorage'
import { getLabels } from '../../services/helpers'
import { reportError } from '../../services/sentry'
import AudioRecordOverlay from './components/AudioRecordOverlay'
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
  shadow-color: ${props => props.theme.colors.shadow};
  elevation: 8;
  shadow-radius: 5px;
  shadow-offset: 1px 1px;
  shadow-opacity: 0.5;
`

const PlayContainer = styled.Pressable<{ isActive: boolean }>`
  align-self: center;
  justify-content: center;
  align-items: center;
  background-color: ${props =>
    props.isActive ? props.theme.colors.audioIconSelected : props.theme.colors.audioIconHighlight};
  border-radius: 50px;
  shadow-color: ${props => props.theme.colors.shadow};
  elevation: 8;
  shadow-radius: 5px;
  shadow-offset: 1px 1px;
  shadow-opacity: 0.5;
`

const AudioText = styled(Subheading)`
  align-self: center;
`

interface UserVocabularyProcessScreenProps {
  navigation: StackNavigationProp<RoutesParams, 'UserVocabularyProcess'>
}

const accuracy = 0.1
const playTolerance = 200

const audioRecorderPlayer = new AudioRecorderPlayer()
audioRecorderPlayer.setSubscriptionDuration(accuracy).catch(e => e)

const UserVocabularyProcessScreen = ({ navigation }: UserVocabularyProcessScreenProps): ReactElement => {
  const [images, setImages] = useState<string[]>([])
  const [word, setWord] = useState<string>('')
  const [articleId, setArticleId] = useState<number | null>(null)
  const [hasWordErrorMessage, setHasWordErrorMessage] = useState<boolean>(false)
  const [hasArticleErrorMessage, setHasArticleErrorMessage] = useState<boolean>(false)
  const [hasImageErrorMessage, setHasImageErrorMessage] = useState<boolean>(false)
  const [showImageSelectionOverlay, setShowImageSelectionOverlay] = useState<boolean>(false)
  const [showAudioRecordOverlay, setShowAudioRecordOverlay] = useState<boolean>(false)
  const [recordSeconds, setRecordSeconds] = useState<number>(0)
  const [recordingPath, setRecordingPath] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

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

  const getAudioPath = async (): Promise<string> => {
    const id = await getNextUserVocabularyId()
    const filename = `audio-${id}`
    return Platform.select({
      ios: `${filename}.m4a`,
      android: `${DocumentDirectoryPath}/${filename}.mp3`,
    })!
  }

  const deleteRecording = (): void => {
    setRecordingPath(null)
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

      await addUserVocabularyItem({
        id,
        word,
        article: ARTICLES[articleId],
        images: imagePaths,
        audio: recordingPath ?? '',
        alternatives: [],
        type: VOCABULARY_ITEM_TYPES.userCreated,
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

  const onStartPlay = async (): Promise<void> => {
    if (recordingPath) {
      await audioRecorderPlayer.startPlayer(recordingPath)
      audioRecorderPlayer.addPlayBackListener(e => {
        setIsPlaying(e.currentPosition < recordSeconds - playTolerance)
      })
    }
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
        setRecordingPath={setRecordingPath}
        recordingPath={recordingPath}
        setShowAudioRecordOverlay={setShowAudioRecordOverlay}
        setRecordSeconds={setRecordSeconds}
        audioRecorderPlayer={audioRecorderPlayer}
        getCurrentPath={getAudioPath}
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
              <PlayContainer onPress={() => onStartPlay()} isActive={isPlaying} testID='play-audio-recording'>
                <VolumeUpCircleIcon width={theme.spacingsPlain.lg} height={theme.spacingsPlain.lg} />
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
