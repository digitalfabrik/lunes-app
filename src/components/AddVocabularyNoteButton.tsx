import React, { ReactElement } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { AddCircleIcon } from '../../assets/images'
import { getLabels } from '../services/helpers'
import PressableOpacity from './PressableOpacity'
import { SubheadingPrimary } from './text/Subheading'

const Row = styled(PressableOpacity)`
  align-items: center;
  gap: ${props => props.theme.spacings.xs};
  padding: ${props => props.theme.spacings.sm} 0;
`

const Label = styled(SubheadingPrimary)`
  font-size: ${props => props.theme.fonts.largeFontSize};
`

type AddVocabularyNoteButtonProps = {
  onPress: () => void
}

const AddVocabularyNoteButton = ({ onPress }: AddVocabularyNoteButtonProps): ReactElement => {
  const theme = useTheme()
  const { add } = getLabels().notes

  return (
    <Row onPress={onPress} accessibilityLabel={add}>
      <AddCircleIcon width={theme.spacingsPlain.md} height={theme.spacingsPlain.md} color={theme.colors.primary} />
      <Label>{add}</Label>
    </Row>
  )
}

export default AddVocabularyNoteButton
