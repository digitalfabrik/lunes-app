import React, { ReactElement, useState } from 'react'
import styled, { css } from 'styled-components/native'

import useVocabularyNote from '../hooks/useVocabularyNote'
import { VocabularyItemId } from '../models/VocabularyItem'
import { getLabels } from '../services/helpers'
import AddVocabularyNoteButton from './AddVocabularyNoteButton'
import VocabularyNoteCard from './VocabularyNoteCard'
import VocabularyNoteEditor from './VocabularyNoteEditor'
import { ContentText } from './text/Content'
import { Hint, HintSecondary } from './text/Hint'
import { uppercase } from './text/uppercase'

const MAX_PREVIEW_LINES = 3

const PreviewCard = styled(VocabularyNoteCard)<{ hasBorder: boolean }>`
  gap: ${props => props.theme.spacings.xxs};
  ${props =>
    props.hasBorder &&
    css`
      border: 1px solid ${props.theme.colors.backgroundHigh};
    `}
`

const ShowMoreLabel = styled(Hint)`
  color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.fonts.contentFontBold};
`

const Heading = styled(HintSecondary)`
  ${uppercase};
`

type VocabularyNotePreviewProps = {
  wordId: VocabularyItemId
  // Needed when the note sits on a white background instead of a coloured result sheet
  hasBorder?: boolean
}

const VocabularyNotePreview = ({ wordId, hasBorder = false }: VocabularyNotePreviewProps): ReactElement => {
  const { note, isEditorOpen, openEditor, closeEditor } = useVocabularyNote(wordId)
  const [isNoteTruncated, setIsNoteTruncated] = useState<boolean>(false)

  const { heading, edit, showMore } = getLabels().notes

  return (
    <>
      {note ? (
        <PreviewCard onPress={openEditor} accessibilityLabel={edit} hasBorder={hasBorder}>
          <Heading>{heading}</Heading>
          <ContentText
            numberOfLines={MAX_PREVIEW_LINES}
            onTextLayout={event => setIsNoteTruncated(event.nativeEvent.lines.length >= MAX_PREVIEW_LINES)}
          >
            {note.text}
          </ContentText>
          {isNoteTruncated && <ShowMoreLabel>{showMore}</ShowMoreLabel>}
        </PreviewCard>
      ) : (
        <AddVocabularyNoteButton onPress={openEditor} />
      )}
      {isEditorOpen && <VocabularyNoteEditor wordId={wordId} existingText={note?.text ?? null} onClose={closeEditor} />}
    </>
  )
}

export default VocabularyNotePreview
