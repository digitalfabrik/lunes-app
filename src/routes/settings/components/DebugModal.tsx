import React, { useState } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import Button from '../../../components/Button'
import ModalSkeleton from '../../../components/ModalSkeleton'
import { ContentSecondary } from '../../../components/text/Content'
import { Subheading } from '../../../components/text/Subheading'
import { BUTTONS_THEME } from '../../../constants/data'
import { getAllWords } from '../../../hooks/useGetAllWords'
import useRepetitionService from '../../../hooks/useRepetitionService'
import useStorage, { useStorageCache } from '../../../hooks/useStorage'
import { RepetitionService, sections } from '../../../services/RepetitionService'
import { getBaseURL, productionCMS, testCMS } from '../../../services/axios'
import { getLabels, getRandomNumberBetween } from '../../../services/helpers'
import { reportError } from '../../../services/sentry'

const Container = styled.View`
  align-items: center;
  padding: ${props => props.theme.spacings.md} ${props => props.theme.spacings.xl};
`

const CodeInput = styled.TextInput`
  border: 1px solid ${props => props.theme.colors.overlay};
  width: ${wp('70%')}px;
  margin: ${props => props.theme.spacings.md};
`

type DebugModalProps = {
  visible: boolean
  onClose: () => void
}

const DebugModal = (props: DebugModalProps): JSX.Element => {
  const storageCache = useStorageCache()
  const { visible, onClose } = props
  const [inputText, setInputText] = useState<string>('')
  const UNLOCKING_TEXT = 'wirschaffendas'
  const [isDevModeEnabled, setIsDevModeEnabled] = useStorage('isDevModeEnabled')
  const {
    sentry,
    currentCMS,
    changeCMS,
    disableDevMode,
    enableDevMode,
    fillRepetitionExerciseWithData,
    clearProfessions,
  } = getLabels().settings.debugModal
  const repetitionService = useRepetitionService()

  const [cmsUrlOverwrite, setCmsUrlOverwrite] = useStorage('cmsUrlOverwrite')
  const baseURL = getBaseURL(cmsUrlOverwrite)
  const [_, setSelectedProfessions] = useStorage('selectedProfessions')

  const throwSentryError = (): void => {
    reportError('Error for testing Sentry')
    throw Error('This error was thrown for testing purposes. Please ignore this error.')
  }

  const resetTextAndClose = (): void => {
    setInputText('')
    onClose()
  }

  const switchCMS = async (): Promise<void> => {
    const updatedCMS = baseURL === productionCMS ? testCMS : productionCMS
    await setCmsUrlOverwrite(updatedCMS)
  }

  const doToggleDevMode = async (): Promise<void> => {
    await setIsDevModeEnabled(!isDevModeEnabled)
  }

  const resetProfessions = async (): Promise<void> => {
    await setSelectedProfessions(null)
  }

  const NUMBER_OF_TEST_VOCABULARY = 5
  const MAX_DAYS_IN_A_SECTION = 100
  const createTestDataForRepetitionExercise = async (): Promise<void> => {
    const allWords = await getAllWords(storageCache)
    const wordCards = allWords.slice(0, NUMBER_OF_TEST_VOCABULARY).map(vocabularyItem => ({
      word: vocabularyItem,
      section: sections[getRandomNumberBetween(0, sections.length - 1)],
      inThisSectionSince: RepetitionService.addDays(new Date(), -getRandomNumberBetween(0, MAX_DAYS_IN_A_SECTION)),
    }))
    await repetitionService.setWordNodeCards(wordCards)
  }

  return (
    <ModalSkeleton testID='debug-modal' visible={visible} onClose={resetTextAndClose}>
      <CodeInput placeholder='Development Code' onChangeText={setInputText} />
      {inputText.toLowerCase() === UNLOCKING_TEXT && (
        <Container>
          <Button label={sentry} onPress={throwSentryError} buttonTheme={BUTTONS_THEME.contained} />
          <Subheading>{currentCMS}:</Subheading>
          <ContentSecondary>{baseURL}</ContentSecondary>
          <Button label={changeCMS} onPress={switchCMS} buttonTheme={BUTTONS_THEME.contained} />
          <Button
            label={isDevModeEnabled ? disableDevMode : enableDevMode}
            onPress={doToggleDevMode}
            buttonTheme={BUTTONS_THEME.contained}
          />
          <Button
            onPress={createTestDataForRepetitionExercise}
            label={fillRepetitionExerciseWithData}
            buttonTheme={BUTTONS_THEME.contained}
          />
          <Button onPress={resetProfessions} label={clearProfessions} buttonTheme={BUTTONS_THEME.contained} />
        </Container>
      )}
    </ModalSkeleton>
  )
}
export default DebugModal
