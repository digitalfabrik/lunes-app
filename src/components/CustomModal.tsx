import React, { ReactNode } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { BUTTONS_THEME } from '../constants/data'
import labels from '../constants/labels.json'
import Button from './Button'
import ModalSkeleton from './ModalSkeleton'
import { HeadingText } from './text/Heading'

const Message = styled(HeadingText)`
  width: ${wp('60%')}px;
  margin-bottom: ${props => props.theme.spacings.lg};
  padding-top: ${props => props.theme.spacings.lg};
  text-align: center;
`

export interface CustomModalProps {
  visible: boolean
  onClose: () => void
  text: string
  children?: ReactNode
  confirmationButtonText: string
  showCancelButton?: boolean
  confirmationAction: () => void
  confirmationDisabled?: boolean
  testID?: string
}

// TODO Further adjustments gonna be done with LUN-312
const CustomModal = (props: CustomModalProps): JSX.Element => {
  const {
    visible,
    text,
    confirmationButtonText,
    showCancelButton = true,
    confirmationAction,
    children,
    onClose,
    confirmationDisabled = false,
    testID
  } = props

  return (
    <ModalSkeleton visible={visible} onClose={onClose} testID={testID}>
      <Message>{text}</Message>
      {children}

      <Button
        label={confirmationButtonText}
        onPress={confirmationAction}
        disabled={confirmationDisabled}
        buttonTheme={BUTTONS_THEME.contained}
      />
      {showCancelButton && (
        <Button label={labels.general.customModalCancel} onPress={onClose} buttonTheme={BUTTONS_THEME.outlined} />
      )}
    </ModalSkeleton>
  )
}
export default CustomModal
