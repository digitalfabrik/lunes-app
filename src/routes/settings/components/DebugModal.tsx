import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import Button from '../../../components/Button'
import ModalSkeleton from '../../../components/ModalSkeleton'
import { ContentSecondary } from '../../../components/text/Content'
import { Subheading } from '../../../components/text/Subheading'
import { BUTTONS_THEME } from '../../../constants/data'
import useLoadAsync from '../../../hooks/useLoadAsync'
import { toggleDevMode, getDevMode, setOverwriteCMS } from '../../../services/AsyncStorage'
import { getBaseURL, productionCMS, testCMS } from '../../../services/axios'
import { getLabels } from '../../../services/helpers'
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

  return (
    <ModalSkeleton testID='debug-modal' visible={visible} onClose={resetTextAndClose}>
      <CodeInput placeholder='Development Code' onChangeText={setInputText} />
      {inputText.toLowerCase() === UNLOCKING_TEXT && (
        <Container>
          <Button
            label={getLabels().settings.debugModal.sentry}
            onPress={throwSentryError}
            buttonTheme={BUTTONS_THEME.contained}
          />
          <Subheading>{getLabels().settings.debugModal.currentCMS}:</Subheading>
          <ContentSecondary>{baseURL}</ContentSecondary>
          <Button
            label={getLabels().settings.debugModal.changeCMS}
            onPress={switchCMS}
            buttonTheme={BUTTONS_THEME.contained}
          />
          <Button
            label={
              isDevMode ? getLabels().settings.debugModal.disableDevMode : getLabels().settings.debugModal.enableDevMode
            }
            onPress={doToggleDevMode}
            buttonTheme={BUTTONS_THEME.contained}
          />
        </Container>
      )}
    </ModalSkeleton>
  )
}
export default DebugModal
