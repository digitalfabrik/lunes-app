import React, { ReactElement, useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled, { useTheme } from 'styled-components/native'

import { AudioCircleIcon, PhotoCircleIcon } from '../../../assets/images'
import Button from '../../components/Button'
import CustomTextInput from '../../components/CustomTextInput'
import RouteWrapper from '../../components/RouteWrapper'
import { Heading } from '../../components/text/Heading'
import { ARTICLES, ArticleType, BUTTONS_THEME } from '../../constants/data'
import { getLabels } from '../../services/helpers'

const StyledHeading = styled(Heading)`
  text-align: center;
  margin: ${props => props.theme.spacings.sm};
`

const StyledDropDownPicker = styled(DropDownPicker)<{ selected: boolean }>`
  border-radius: 0;
  height: 60px;
  border: 1px solid ${props => (props.selected ? props.theme.colors.primary : props.theme.colors.textSecondary)};
`

const Root = styled.View`
  padding: ${props => props.theme.spacings.md};
  flex: 1;
`

const SaveButton = styled(Button)`
  margin-top: ${props => props.theme.spacings.lg};
  align-self: center;
`

const AddButton = styled(Button)`
  margin-top: ${props => props.theme.spacings.md};
  justify-content: flex-start;
  padding: 0;
`

const StyledCustomTextInput = styled(CustomTextInput)`
  margin-bottom: ${props => props.theme.spacings.lg};
`

const UserVocabularyCreationScreen = (): ReactElement => {
  const theme = useTheme()
  const [open, setOpen] = useState<boolean>(false)
  const [word, setWord] = useState<string>('')
  const [articleId, setArticleId] = useState<number | null>(null)

  const onSubmit = (): void => {
    setWord('')
    setArticleId(null)
    // TODO add logic
  }
  return (
    <RouteWrapper>
      <Root>
        <StyledHeading>{getLabels().ownVocabulary.creation.headline}</StyledHeading>
        <StyledCustomTextInput
          value={word}
          onChangeText={setWord}
          placeholder={getLabels().ownVocabulary.creation.wordPlaceholder}
        />
        <StyledDropDownPicker
          multiple={false}
          selected={open}
          open={open}
          setOpen={setOpen}
          setValue={setArticleId}
          value={articleId}
          items={ARTICLES.filter(article => article.value !== 'keiner') as ArticleType[]}
          schema={{ label: 'label', value: 'id' }}
          itemKey='id'
          placeholder={getLabels().ownVocabulary.creation.articlePlaceholder}
          labelStyle={{ fontSize: wp('4%'), paddingHorizontal: wp('2%') }}
          placeholderStyle={{
            fontSize: wp('4%'),
            fontFamily: theme.fonts.contentFontRegular,
            color: theme.colors.textSecondary,
            paddingHorizontal: wp('2%'),
          }}
          dropDownContainerStyle={{ borderRadius: 0 }}
        />
        <AddButton
          onPress={onSubmit}
          label={getLabels().ownVocabulary.creation.addImageLabel.toUpperCase()}
          buttonTheme={BUTTONS_THEME.text}
          iconLeft={PhotoCircleIcon}
          iconSize={wp('10%')}
        />
        <AddButton
          onPress={onSubmit}
          label={getLabels().ownVocabulary.creation.addAudioLabel.toUpperCase()}
          buttonTheme={BUTTONS_THEME.text}
          iconLeft={AudioCircleIcon}
          iconSize={wp('10%')}
        />
        <SaveButton
          onPress={onSubmit}
          label={getLabels().ownVocabulary.creation.buttonLabel}
          buttonTheme={BUTTONS_THEME.contained}
          disabled={!articleId || word.length === 0}
        />
      </Root>
    </RouteWrapper>
  )
}

export default UserVocabularyCreationScreen
