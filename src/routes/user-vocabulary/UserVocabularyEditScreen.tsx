import React, { ReactElement, useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { MicrophoneCircleIcon, PhotoCircleIcon } from '../../../assets/images'
import Button from '../../components/Button'
import CustomTextInput from '../../components/CustomTextInput'
import Dropdown from '../../components/Dropdown'
import RouteWrapper from '../../components/RouteWrapper'
import { TitleSpacing } from '../../components/Title'
import { HintText } from '../../components/text/Hint'
import { BUTTONS_THEME, getArticleWithLabel } from '../../constants/data'
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
const AddImageButton = styled(AddAudioButton)`
  margin-bottom: 0;
  margin-top: ${props => props.theme.spacings.sm};
`

const StyledHintText = styled(HintText)`
  margin-left: ${props => props.theme.spacings.xxl};
`

const UserVocabularyEditScreen = (): ReactElement => {
  const [word, setWord] = useState<string>('')
  const [articleId, setArticleId] = useState<number | null>(null)
  const [wordErrorMessage, setWordErrorMessage] = useState<string>('')
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
      setWordErrorMessage(errorMessage)
    } else {
      setWordErrorMessage('')
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
      <KeyboardAwareScrollView>
        <Root>
          <TitleSpacing title={headline} />
          <CustomTextInput
            clearable
            value={word}
            onChangeText={setWord}
            placeholder={wordPlaceholder}
            errorMessage={wordErrorMessage}
          />
          <Dropdown
            value={articleId}
            setValue={setArticleId}
            placeholder={articlePlaceholder}
            items={getArticleWithLabel()}
            itemKey='id'
            errorMessage={articleErrorMessage}
          />
          <AddImageButton
            onPress={() => null}
            label={addImage}
            buttonTheme={BUTTONS_THEME.text}
            iconLeft={PhotoCircleIcon}
            iconSize={wp('10%')}
          />
          <StyledHintText>{maxPictureUpload}</StyledHintText>
          <AddAudioButton
            onPress={() => null}
            label={addAudio}
            buttonTheme={BUTTONS_THEME.text}
            iconLeft={MicrophoneCircleIcon}
            iconSize={wp('10%')}
          />
          <HintText>{requiredFields}</HintText>
          <SaveButton onPress={onSave} label={saveButton} buttonTheme={BUTTONS_THEME.contained} />
        </Root>
      </KeyboardAwareScrollView>
    </RouteWrapper>
  )
}

export default UserVocabularyEditScreen
