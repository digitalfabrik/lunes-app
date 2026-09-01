import React, { ReactElement, useState } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { AddCircleIcon, PenIcon, TrashIcon } from '../../assets/images'
import useStorage, { useStorageCache } from '../hooks/useStorage'
import VocabularyItem from '../models/VocabularyItem'
import { getLabels } from '../services/helpers'
import { reportError } from '../services/sentry'
import { deleteVocabularyNote, getVocabularyNote, saveVocabularyNote } from '../services/storageUtils'
import CircularIconButton from './CircularIconButton'
import CustomTextInput from './CustomTextInput'
import Modal from './Modal'
import PressableOpacity from './PressableOpacity'
import { ContentSecondary, ContentText } from './text/Content'
import { SubheadingText } from './text/Subheading'

const MAX_NOTE_CHARACTERS = 500
const NOTE_INPUT_LINES = 8

const Root = styled.View`
  padding-top: ${props => props.theme.spacings.sm};
`

const AddNoteRow = styled(PressableOpacity)`
  align-items: center;
  gap: ${props => props.theme.spacings.xs};
  padding: ${props => props.theme.spacings.sm} 0;
`

const AddNoteLabel = styled(SubheadingText)`
  font-size: ${props => props.theme.fonts.largeFontSize};
  color: ${props => props.theme.colors.primary};
`

const HeadingRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: ${props => props.theme.spacings.xs};
`

const Heading = styled(ContentSecondary)`
  letter-spacing: ${props => props.theme.fonts.capsLetterSpacing};
  text-transform: uppercase;
`

const NoteCard = styled(PressableOpacity)`
  background-color: ${props => props.theme.colors.backgroundAccent};
  border: 1px solid ${props => props.theme.colors.backgroundHigh};
  border-radius: ${props => props.theme.spacings.xs};
  padding: ${props => props.theme.spacings.sm};
`

// The card is a row, so the note has to shrink to wrap instead of overflowing
const NoteText = styled(ContentText)`
  flex: 1;
`

const ActionContainer = styled.View`
  flex-direction: row;
  gap: ${props => props.theme.spacings.xs};
`

const NoteIconButton = styled(CircularIconButton)`
  background-color: ${props => props.theme.colors.backgroundAccent};
`

const DeletionExplanation = styled(ContentSecondary)`
  padding: 0 ${props => props.theme.spacings.sm} ${props => props.theme.spacings.md};
  text-align: center;
`

const TextInputContainer = styled.View`
  width: 85%;
  margin-bottom: ${props => props.theme.spacings.lg};
`

// Text and flag in one state, so that closing the editor cannot leave the flag behind and flash
// the empty-note error while the modal fades out
type NoteDraft = {
  text: string
  hasBeenEdited: boolean
}

type VocabularyNoteSectionProps = {
  vocabularyItem: VocabularyItem
}

const VocabularyNoteSection = ({ vocabularyItem }: VocabularyNoteSectionProps): ReactElement => {
  const theme = useTheme()
  const storageCache = useStorageCache()
  const [vocabularyNotes] = useStorage('vocabularyNotes')
  const [noteDraft, setNoteDraft] = useState<NoteDraft | null>(null)
  const [isDeletionConfirmationVisible, setIsDeletionConfirmationVisible] = useState<boolean>(false)

  const {
    sectionTitle,
    newNote,
    add,
    edit,
    delete: deleteLabel,
    languageHint,
    placeholder,
    emptyError,
    confirmDeletionTitle,
    confirmDeletion,
    confirm,
    cancel,
    save,
  } = getLabels().notes

  const note = getVocabularyNote(vocabularyNotes, vocabularyItem.id)
  const isEditorVisible = noteDraft !== null
  const noteDraftText = noteDraft?.text ?? ''
  const isNoteDraftBlank = noteDraftText.trim().length === 0
  const shouldShowEmptyError = (noteDraft?.hasBeenEdited ?? false) && isNoteDraftBlank

  const openEditor = (initialText: string): void =>
    setNoteDraft({ text: initialText, hasBeenEdited: initialText.length > 0 })

  const changeNoteDraft = (text: string): void => setNoteDraft({ text, hasBeenEdited: true })

  const closeEditor = (): void => setNoteDraft(null)

  const submitNote = (): void => {
    saveVocabularyNote(storageCache, vocabularyItem.id, noteDraftText).catch(reportError)
    closeEditor()
  }

  const deleteNote = (): void => {
    deleteVocabularyNote(storageCache, vocabularyItem.id).catch(reportError)
    setIsDeletionConfirmationVisible(false)
  }

  const noteContent = (): ReactElement => {
    if (note === undefined) {
      return (
        <AddNoteRow onPress={() => openEditor('')} accessibilityLabel={add}>
          <AddCircleIcon width={theme.spacingsPlain.md} height={theme.spacingsPlain.md} color={theme.colors.primary} />
          <AddNoteLabel>{add}</AddNoteLabel>
        </AddNoteRow>
      )
    }

    return (
      <>
        <HeadingRow>
          <Heading>{sectionTitle}</Heading>
          <ActionContainer>
            <NoteIconButton onPress={() => openEditor(note.text)} accessibilityLabel={edit} hasBorder>
              <PenIcon testID='edit-note-icon' color={theme.colors.text} />
            </NoteIconButton>
            <NoteIconButton
              onPress={() => setIsDeletionConfirmationVisible(true)}
              accessibilityLabel={deleteLabel}
              hasBorder
            >
              <TrashIcon testID='delete-note-icon' color={theme.colors.incorrect} />
            </NoteIconButton>
          </ActionContainer>
        </HeadingRow>
        <NoteCard onPress={() => openEditor(note.text)}>
          <NoteText>{note.text}</NoteText>
        </NoteCard>
      </>
    )
  }

  return (
    <>
      <Root>{noteContent()}</Root>
      <Modal
        testID='noteEditorModal'
        visible={isEditorVisible}
        onClose={closeEditor}
        text={note ? edit : newNote}
        confirmationButtonText={save}
        cancelButtonText={cancel}
        confirmationAction={submitNote}
        confirmationDisabled={isNoteDraftBlank}
      >
        <TextInputContainer>
          <CustomTextInput
            value={noteDraftText}
            onChangeText={changeNoteDraft}
            placeholder={placeholder}
            lines={NOTE_INPUT_LINES}
            characterLimit={MAX_NOTE_CHARACTERS}
            hint={languageHint}
            errorMessage={shouldShowEmptyError ? emptyError : ''}
            clearable
          />
        </TextInputContainer>
      </Modal>
      <Modal
        visible={isDeletionConfirmationVisible}
        onClose={() => setIsDeletionConfirmationVisible(false)}
        text={confirmDeletionTitle}
        confirmationButtonText={confirm}
        cancelButtonText={cancel}
        confirmationAction={deleteNote}
      >
        <DeletionExplanation>{confirmDeletion}</DeletionExplanation>
      </Modal>
    </>
  )
}

export default VocabularyNoteSection
