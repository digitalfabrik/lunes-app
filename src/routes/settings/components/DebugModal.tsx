import React, { useState } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import Button from '../../../components/Button'
import ModalSkeleton from '../../../components/ModalSkeleton'
import { BUTTONS_THEME } from '../../../constants/data'
import labels from '../../../constants/labels.json'
import { reportError } from '../../../services/sentry'

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
  const UNLOCKING_TEXT = 'wirschaffendas'

  const throwSentryError = (): void => {
    reportError('Error for testing Sentry')
    throw Error('This error was thrown for testing purposes. Please ignore this error.')
  }

  const resetTextAndClose = (): void => {
    setInputText('')
    onClose()
  }

  return (
    <ModalSkeleton testID='debug-modal' visible={visible} onClose={resetTextAndClose}>
      <CodeInput placeholder='Development Code' onChangeText={setInputText} />
      {inputText.toLowerCase() === UNLOCKING_TEXT && (
        <Button
          label={labels.settings.debugModal.sentry}
          onPress={throwSentryError}
          buttonTheme={BUTTONS_THEME.contained}
        />
      )}
    </ModalSkeleton>
  )
}
export default DebugModal
