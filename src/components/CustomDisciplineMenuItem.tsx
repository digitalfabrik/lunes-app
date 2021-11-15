import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useState } from 'react'
import { Animated } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { TrashBinIcon } from '../../assets/images'
import labels from '../constants/labels.json'
import { useLoadGroupInfo } from '../hooks/useLoadGroupInfo'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import AsyncStorage from '../services/AsyncStorage'
import ConfirmationModal from './ConfirmationModal'
import Loading from './Loading'
import MenuItem from './MenuItem'

const widthOfTrashButton = wp('18%')

const Placeholder = styled.View`
  height: ${wp('22%')}px;
  background-color: ${props => props.theme.colors.white};
  margin: 0px 16px 8px 16px;
  border: 1px solid ${prop => prop.theme.colors.lunesBlackUltralight};
  border-radius: 2px;
`

const LoadingSpinner = styled.View`
  padding-top: ${wp('10%')}px;
`

const Description = styled.Text<{ selected: boolean }>`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${props => (props.selected ? props.theme.colors.white : props.theme.colors.lunesGreyMedium)};
`

const ErrorText = styled.Text`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${props => props.theme.colors.lunesRed};
  margin: 10px;
`

const DeleteContainer = styled.View`
  width: ${widthOfTrashButton};
`

const DeleteButton = styled(RectButton)`
  height: ${wp('21%')}px;
  margin: 0 16px 8px -16px;
  align-items: center;
  flex: 1;
  justify-content: center;
  background-color: ${props => props.theme.colors.lunesFunctionalIncorrectDark};
  width: ${widthOfTrashButton};
`

interface CustomDisciplineMenuItemPropsType {
  apiKey: string
  selectedId: string | null
  setSelectedId: (input: string) => void
  navigation: StackNavigationProp<RoutesParamsType, 'Home'>
  refresh: () => void
}

const CustomDisciplineMenuItem = ({
  apiKey,
  selectedId,
  setSelectedId,
  navigation,
  refresh
}: CustomDisciplineMenuItemPropsType): JSX.Element => {
  const { data, loading } = useLoadGroupInfo(apiKey)

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

  const renderRightAction = (progress: Animated.AnimatedInterpolation): ReactElement => {
    if (!apiKey) {
      return <></>
    }
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0]
    })

    const pressHandler = (): void => {
      close()
      setIsModalVisible(true)
    }

    return (
      <DeleteContainer>
        <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
          <DeleteButton onPress={pressHandler}>
            <TrashBinIcon />
          </DeleteButton>
        </Animated.View>
      </DeleteContainer>
    )
  }

  const deleteModule = (): void => {
    if (!apiKey) {
      return
    }

    AsyncStorage.deleteCustomDiscipline(apiKey)
      .then(() => {
        refresh()
      })
      .catch((e: Error) => console.log(e.message))

    setIsModalVisible(false)
  }

  let swipeableRow: Swipeable

  const updateRef = (ref: Swipeable): void => {
    swipeableRow = ref
    swipeableRow?.close()
  }
  const close = (): void => {
    swipeableRow.close()
  }

  const idToSelectedIdString = (id: number): string => {
    return `custom-${id}`
  }

  if (loading) {
    return (
      <Placeholder>
        <LoadingSpinner>
          <Loading isLoading={true} />
        </LoadingSpinner>
      </Placeholder>
    )
  } else if (data) {
    return (
      <Swipeable
        ref={updateRef}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={renderRightAction}>
        <ConfirmationModal
          visible={isModalVisible}
          setVisible={setIsModalVisible}
          text={labels.home.deleteModal.confirmationQuestion}
          confirmationButtonText={labels.home.deleteModal.confirm}
          cancelButtonText={labels.home.deleteModal.cancel}
          confirmationAction={deleteModule}
        />
        <MenuItem
          selected={idToSelectedIdString(data.id) === selectedId}
          onPress={() => {
            setSelectedId(idToSelectedIdString(data.id))
            navigation.navigate('DisciplineSelection', {
              extraParams: { discipline: data }
            })
          }}
          icon={data.icon}
          title={data.title}>
          <Description selected={idToSelectedIdString(data.id) === selectedId}>
            {data.numberOfChildren} {data.numberOfChildren === 1 ? labels.home.unit : labels.home.units}
          </Description>
        </MenuItem>
      </Swipeable>
    )
  } else {
    return (
      <Placeholder>
        <ErrorText>
          {labels.home.errorLoadCustomDiscipline} {apiKey}
        </ErrorText>
      </Placeholder>
    )
  }
}

export default CustomDisciplineMenuItem
