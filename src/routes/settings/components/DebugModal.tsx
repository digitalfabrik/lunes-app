import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import Button from '../../../components/Button'
import ModalSkeleton from '../../../components/ModalSkeleton'
import { ContentSecondary } from '../../../components/text/Content'
import { Subheading } from '../../../components/text/Subheading'
import { BUTTONS_THEME } from '../../../constants/data'
import { getAllWords } from '../../../hooks/useGetAllWords'
import useLoadAsync from '../../../hooks/useLoadAsync'
import { toggleDevMode, getDevMode, setOverwriteCMS } from '../../../services/AsyncStorage'
import { RepetitionService, sections } from '../../../services/RepetitionService'
import { useWordNodeCards } from '../../../services/SyncStorage'
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
  const { visible, onClose } = props
  const [inputText, setInputText] = useState<string>('')
  const [baseURL, setBaseURL] = useState<string>('')
  const UNLOCKING_TEXT = 'wirschaffendas'
  const { data: isDevMode, refresh } = useLoadAsync(getDevMode, null)
  const { sentry, currentCMS, changeCMS, disableDevMode, enableDevMode, fillRepetitionExerciseWithData } =
    getLabels().settings.debugModal
  const [_wordNodeCards, setWordNodeCards] = useWordNodeCards()

  useEffect(() => {
    getBaseURL().then(setBaseURL).catch(reportError)
  }, [])

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
    await setOverwriteCMS(updatedCMS)
    setBaseURL(updatedCMS)
  }

  const doToggleDevMode = async (): Promise<void> => {
    await toggleDevMode()
    refresh()
  }

  const NUMBER_OF_TEST_VOCABULARY = 5
  const MAX_DAYS_IN_A_SECTION = 100
  const createTestDataForRepetitionExercise = async (): Promise<void> => {
    const allWords = await getAllWords()
    const wordCards = allWords.slice(0, NUMBER_OF_TEST_VOCABULARY).map(vocabularyItem => ({
      word: vocabularyItem,
      section: sections[getRandomNumberBetween(0, sections.length - 1)],
      inThisSectionSince: RepetitionService.addDays(new Date(), -getRandomNumberBetween(0, MAX_DAYS_IN_A_SECTION)),
    }))
    setWordNodeCards(wordCards)
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
            label={isDevMode ? disableDevMode : enableDevMode}
            onPress={doToggleDevMode}
            buttonTheme={BUTTONS_THEME.contained}
          />
          <Button
            onPress={createTestDataForRepetitionExercise}
            label={fillRepetitionExerciseWithData}
            buttonTheme={BUTTONS_THEME.contained}
          />
        </Container>
      )}
    </ModalSkeleton>
  )
}
export default DebugModal
