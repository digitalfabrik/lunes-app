import React, { ReactElement, useState } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { AudioCircleIcon, PhotoCircleIcon } from '../../../assets/images'
import Button from '../../components/Button'
import CustomTextInput from '../../components/CustomTextInput'
import Dropdown from '../../components/Dropdown'
import RouteWrapper from '../../components/RouteWrapper'
import ScreenHeading from '../../components/ScreenHeading'
import { HintText } from '../../components/text/Hint'
import { ARTICLES, BUTTONS_THEME } from '../../constants/data'
import { getLabels } from '../../services/helpers'

const Root = styled.View`
  padding: ${props => props.theme.spacings.md};
  flex: 1;
`

const SaveButton = styled(Button)`
  margin-top: ${props => props.theme.spacings.lg};
  align-self: center;
`

const AddAudioButton = styled(Button)`
  margin-top: ${props => props.theme.spacings.md};
  justify-content: flex-start;
  padding: 0;
`
const AddPictureButton = styled(AddAudioButton)`
  margin-bottom: 0;
  margin-top: ${props => props.theme.spacings.sm};
`

const StyledHintText = styled(HintText)`
  margin-left: ${props => props.theme.spacings.xxl};
`

const UserVocabularyCreationScreen = (): ReactElement => {
  const [word, setWord] = useState<string>('')
  const [articleId, setArticleId] = useState<number | null>(null)
  const [textErrorMessage, setTextErrorMessage] = useState<string>('')
  const [articleErrorMessage, setArticleErrorMessage] = useState<string>('')
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
  } = getLabels().ownVocabulary.creation

  const onSave = (): void => {
    const hasError = word.length === 0 || !articleId
    // TODO LUN-419
    if (word.length === 0) {
      setTextErrorMessage(errorMessage)
    } else {
      setTextErrorMessage('')
    }
    if (!articleId) {
      setArticleErrorMessage(errorMessage)
    } else {
      setArticleErrorMessage('')
    }

    if (!hasError) {
      setWord('')
      setArticleId(null)
    }
  }

  return (
    <RouteWrapper>
      <Root>
        <ScreenHeading title={headline} />
        <CustomTextInput
          clearable
          value={word}
          onChangeText={setWord}
          placeholder={wordPlaceholder}
          errorMessage={textErrorMessage}
        />
        <Dropdown
          value={articleId}
          setValue={setArticleId}
          placeholder={articlePlaceholder}
          items={ARTICLES.filter(article => article.value !== 'keiner')}
          itemKey='id'
          errorMessage={articleErrorMessage}
        />
        <AddPictureButton
          onPress={() => null}
          label={addImage.toUpperCase()}
          buttonTheme={BUTTONS_THEME.text}
          iconLeft={PhotoCircleIcon}
          iconSize={wp('10%')}
        />
        <StyledHintText>{maxPictureUpload}</StyledHintText>
        <AddAudioButton
          onPress={() => null}
          label={addAudio.toUpperCase()}
          buttonTheme={BUTTONS_THEME.text}
          iconLeft={AudioCircleIcon}
          iconSize={wp('10%')}
        />
        <HintText>{requiredFields}</HintText>
        <SaveButton onPress={onSave} label={saveButton} buttonTheme={BUTTONS_THEME.contained} />
      </Root>
    </RouteWrapper>
  )
}

export default UserVocabularyCreationScreen
