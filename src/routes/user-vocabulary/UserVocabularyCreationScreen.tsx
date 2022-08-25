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
import { ARTICLES, ArticleType, BUTTONS_THEME } from '../../constants/data'
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
`

const StyledCustomTextInput = styled(CustomTextInput)`
  margin-bottom: ${props => props.theme.spacings.sm};
`

const StyledHintText = styled(HintText)`
  margin-left: ${props => props.theme.spacings.xxl};
`

const UserVocabularyCreationScreen = (): ReactElement => {
  const [word, setWord] = useState<string>('')
  const [articleId, setArticleId] = useState<number | null>(null)

  const onSave = (): void => {
    setWord('')
    setArticleId(null)
    // TODO LUN-419
  }

  return (
    <RouteWrapper>
      <Root>
        <ScreenHeading text={getLabels().ownVocabulary.creation.headline} />
        <StyledCustomTextInput
          clearable
          value={word}
          onChangeText={setWord}
          placeholder={getLabels().ownVocabulary.creation.wordPlaceholder}
        />
        <Dropdown
          value={articleId}
          setValue={setArticleId}
          placeholder={getLabels().ownVocabulary.creation.articlePlaceholder}
          items={ARTICLES.filter(article => article.value !== 'keiner') as ArticleType[]}
          itemKey='id'
        />
        <AddPictureButton
          onPress={() => null}
          label={getLabels().ownVocabulary.creation.addImage.toUpperCase()}
          buttonTheme={BUTTONS_THEME.text}
          iconLeft={PhotoCircleIcon}
          iconSize={wp('10%')}
        />
        <StyledHintText>{getLabels().ownVocabulary.creation.maxPictureUpload}</StyledHintText>
        <AddAudioButton
          onPress={() => null}
          label={getLabels().ownVocabulary.creation.addAudio.toUpperCase()}
          buttonTheme={BUTTONS_THEME.text}
          iconLeft={AudioCircleIcon}
          iconSize={wp('10%')}
        />
        <HintText>{getLabels().ownVocabulary.creation.requiredFields}</HintText>
        <SaveButton
          onPress={onSave}
          label={getLabels().ownVocabulary.creation.saveButton}
          buttonTheme={BUTTONS_THEME.contained}
          disabled={!articleId || word.length === 0}
        />
      </Root>
    </RouteWrapper>
  )
}

export default UserVocabularyCreationScreen
