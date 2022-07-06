import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import Button from '../../../components/Button'
import ModalSkeleton from '../../../components/ModalSkeleton'
import { ContentSecondary } from '../../../components/text/Content'
import { Subheading } from '../../../components/text/Subheading'
import { BUTTONS_THEME } from '../../../constants/data'
import labels from '../../../constants/labels.json'
import AsyncStorage from '../../../services/AsyncStorage'
import { getBaseURL, productionCMS, testCMS } from '../../../services/axios'
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

interface PropsType {
  visible: boolean
  onClose: () => void
}

const DebugModal = (props: PropsType): JSX.Element => {
  const { visible, onClose } = props
  const [inputText, setInputText] = useState<string>('')
  const [baseURL, setBaseURL] = useState<string>('')
  const UNLOCKING_TEXT = 'wirschaffendas'

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
    await AsyncStorage.setOverwriteCMS(updatedCMS)
    setBaseURL(updatedCMS)
  }

  return (
    <ModalSkeleton testID='debug-modal' visible={visible} onClose={resetTextAndClose}>
      <CodeInput placeholder='Development Code' onChangeText={setInputText} />
      {inputText.toLowerCase() === UNLOCKING_TEXT && (
        <Container>
          <Button
            label={labels.settings.debugModal.sentry}
            onPress={throwSentryError}
            buttonTheme={BUTTONS_THEME.contained}
          />
          <Subheading>{labels.settings.debugModal.currentCMS}:</Subheading>
          <ContentSecondary>{baseURL}</ContentSecondary>
          <Button
            label={labels.settings.debugModal.changeCMS}
            onPress={switchCMS}
            buttonTheme={BUTTONS_THEME.contained}
          />
        </Container>
      )}
    </ModalSkeleton>
  )
}
export default DebugModal
