import React, { ReactElement, ReactNode, RefObject, useEffect, useRef, useState } from 'react'
import { Animated, View } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { TrashIcon } from '../../assets/images'
import labels from '../constants/labels.json'
import AsyncStorage from '../services/AsyncStorage'
import ConfirmationModal from './ConfirmationModal'

const widthOfTrashButton = `${wp('18%')}px`

const DeleteContainer = styled.View`
  width: ${widthOfTrashButton};
`

const DeleteButton = styled(RectButton)`
  height: ${wp('21%')}px;
  margin: ${props => `0 ${props.theme.spacings.sm} ${props.theme.spacings.xs} -${props.theme.spacings.sm}`};
  align-items: center;
  flex: 1;
  justify-content: center;
  background-color: ${props => props.theme.colors.lunesFunctionalIncorrectDark};
  width: ${widthOfTrashButton};
`

interface DeletionSwipableProps {
  apiKey: string
  refresh: () => void
  children: ReactNode
}

const rightThreshold = 40

const DeletionSwipeable = ({ apiKey, refresh, children }: DeletionSwipableProps): ReactElement => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const swipeableRow: RefObject<Swipeable> = useRef<Swipeable>(null)

  // Closes the swipeable when leaving the screen
  useEffect(() => swipeableRow.current?.close())

  const renderRightAction = (progress: Animated.AnimatedInterpolation): ReactElement => {
    const inputRangeStart = -20
    const outputRangeStart = 50
    const trans = progress.interpolate({
      inputRange: [inputRangeStart, 1],
      outputRange: [outputRangeStart, 0]
    })

    const showConfirmationModal = (): void => {
      swipeableRow.current?.close()
      setIsModalVisible(true)
    }

    return (
      <DeleteContainer>
        <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
          <DeleteButton onPress={showConfirmationModal}>
            <TrashIcon testID='trash-icon' width={wp('6%')} height={wp('6%')} />
          </DeleteButton>
        </Animated.View>
      </DeleteContainer>
    )
  }

  const deleteModule = (): void => {
    AsyncStorage.deleteCustomDiscipline(apiKey)
      .then(() => refresh())
      .catch((e: Error) => console.log(e.message))
    setIsModalVisible(false)
  }

  return (
    <View testID='Swipeable'>
      <Swipeable
        ref={swipeableRow}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={rightThreshold}
        renderRightActions={renderRightAction}>
        <ConfirmationModal
          visible={isModalVisible}
          setVisible={setIsModalVisible}
          text={labels.home.deleteModal.confirmationQuestion}
          confirmationButtonText={labels.home.deleteModal.confirm}
          cancelButtonText={labels.home.deleteModal.cancel}
          confirmationAction={deleteModule}
        />
        {children}
      </Swipeable>
    </View>
  )
}

export default DeletionSwipeable
