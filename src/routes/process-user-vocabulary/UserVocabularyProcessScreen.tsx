import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useState } from 'react'
import { DocumentDirectoryPath, writeFile } from 'react-native-fs'
import styled, { useTheme } from 'styled-components/native'

import { ImageCircleIcon, MicrophoneCircleIcon } from '../../../assets/images'
import Button from '../../components/Button'
import CustomTextInput from '../../components/CustomTextInput'
import Dropdown from '../../components/Dropdown'
import RouteWrapper from '../../components/RouteWrapper'
import { TitleWithSpacing } from '../../components/Title'
import { ContentError } from '../../components/text/Content'
import { HintText } from '../../components/text/Hint'
import { ARTICLES, BUTTONS_THEME, DOCUMENT_TYPES, getArticleWithLabel } from '../../constants/data'
import { RoutesParams } from '../../navigation/NavigationTypes'
import {
  addUserVocabularyItem,
  getNextUserVocabularyId,
  incrementNextUserVocabularyId,
} from '../../services/AsyncStorage'
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

interface UserVocabularyProcessScreenProps {
  navigation: StackNavigationProp<RoutesParams, 'UserVocabularyProcess'>
}

const UserVocabularyProcessScreen = ({ navigation }: UserVocabularyProcessScreenProps): ReactElement => {
  const [images, setImages] = useState<string[]>([])
  const [word, setWord] = useState<string>('')
  const [articleId, setArticleId] = useState<number | null>(null)
  const [hasWordErrorMessage, setHasWordErrorMessage] = useState<boolean>(false)
  const [hasArticleErrorMessage, setHasArticleErrorMessage] = useState<boolean>(false)
  const [hasImageErrorMessage, setHasImageErrorMessage] = useState<boolean>(false)
  const [showImageSelectionOverlay, setShowImageSelectionOverlay] = useState<boolean>(false)

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
        document_image: imagePaths,
        audio: '',
        alternatives: [],
        documentType: DOCUMENT_TYPES.userCreated,
      })

      navigation.navigate('UserVocabularyList', { headerBackLabel: getLabels().general.back })

      setWord('')
      setArticleId(null)
      setImages([])
    } catch (e) {
      reportError(e)
    }
  }

  const pushImage = (uri: string): void => setImages(old => [...old, uri])
  const deleteImage = (uri: string): void => setImages(images => images.filter(image => image !== uri))

  if (showImageSelectionOverlay) {
    return <ImageSelectionOverlay setVisible={setShowImageSelectionOverlay} pushImage={pushImage} />
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

        <AddAudioButton
          onPress={() => null}
          label={addAudio}
          buttonTheme={BUTTONS_THEME.text}
          iconLeft={MicrophoneCircleIcon}
          iconSize={theme.spacingsPlain.xl}
        />
        <HintText>{requiredFields}</HintText>
        <SaveButton onPress={onSave} label={saveButton} buttonTheme={BUTTONS_THEME.contained} />
      </Root>
    </RouteWrapper>
  )
}

export default UserVocabularyProcessScreen
