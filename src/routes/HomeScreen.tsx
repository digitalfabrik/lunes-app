import { useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useRef, useState } from 'react'
import { Pressable } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { AddCircleIcon } from '../../assets/images'
import CustomDisciplineItem from '../components/CustomDisciplineItem'
import DisciplineItem from '../components/DisciplineItem'
import Header from '../components/Header'
import ServerResponseHandler from '../components/ServerResponseHandler'
import { Discipline } from '../constants/endpoints'
import labels from '../constants/labels.json'
import { useLoadDisciplines } from '../hooks/useLoadDisciplines'
import useReadCustomDisciplines from '../hooks/useReadCustomDisciplines'
import { RoutesParams } from '../navigation/NavigationTypes'
import { childrenDescription } from '../services/helpers'

const Root = styled.ScrollView`
  background-color: ${props => props.theme.colors.background};
  height: 100%;
`
const StyledText = styled.Text`
  margin-top: ${props => props.theme.spacings.xxl};
  text-align: center;
  font-size: ${props => props.theme.fonts.defaultFontSize};
  color: ${props => props.theme.colors.textSecondary};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  margin-bottom: ${props => props.theme.spacings.lg};
`

const AddCustomDisciplineContainer = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: ${props => props.theme.spacings.sm};
`

const AddCustomDisciplineText = styled.Text`
  text-transform: uppercase;
  padding-left: ${props => props.theme.spacings.xs};
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${props => props.theme.fonts.defaultFontSize};
`

const Description = styled.Text<{ selected: boolean }>`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${props => (props.selected ? props.theme.colors.backgroundAccent : props.theme.colors.textSecondary)};
`

interface HomeScreenProps {
  navigation: StackNavigationProp<RoutesParams, 'Home'>
}

const HomeScreen = ({ navigation }: HomeScreenProps): JSX.Element => {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedIdRef = useRef(selectedId)
  selectedIdRef.current = selectedId

  const { data: customDisciplines, refresh: refreshCustomDisciplines } = useReadCustomDisciplines()
  const { data: disciplines, error, loading, refresh } = useLoadDisciplines(null)

  const waitForScrollEvent = 100
  const navigationTransitionDuration = 250

  useFocusEffect(
    React.useCallback(() => {
      setSelectedId(null)
      refreshCustomDisciplines()
    }, [refreshCustomDisciplines])
  )

  const handleNavigation = (item: Discipline): void => {
    navigation.navigate('DisciplineSelection', {
      discipline: item
    })
  }

  const navigateToAddCustomDisciplineScreen = (): void => {
    navigation.navigate('AddCustomDiscipline')
  }

  return (
    <Root onScrollBeginDrag={() => setSelectedId(null)}>
      <Header />
      <StyledText>{labels.home.welcome}</StyledText>
      <AddCustomDisciplineContainer onPress={navigateToAddCustomDisciplineScreen}>
        <AddCircleIcon width={wp('8%')} height={wp('8%')} />
        <AddCustomDisciplineText>{labels.home.addCustomDiscipline}</AddCustomDisciplineText>
      </AddCustomDisciplineContainer>
      {customDisciplines?.map(customDiscipline => (
        <CustomDisciplineItem
          key={customDiscipline}
          apiKey={customDiscipline}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          navigation={navigation}
          refresh={refreshCustomDisciplines}
        />
      ))}
      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        {disciplines?.map(item => {
          if (item.numberOfChildren === 0) {
            return null
          }
          return (
            <Pressable
              key={item.id}
              onPress={() => {
                setSelectedId(item.id.toString())
                handleNavigation(item)
                setTimeout(() => {
                  setSelectedId(null)
                }, navigationTransitionDuration)
              }}
              onLongPress={() => setSelectedId(item.id.toString())}
              delayLongPress={200}
              onPressOut={() => {
                setTimeout(() => {
                  if (selectedIdRef.current !== null) {
                    handleNavigation(item)
                    setTimeout(() => {
                      setSelectedId(null)
                    }, navigationTransitionDuration)
                  }
                }, waitForScrollEvent)
              }}>
              <DisciplineItem item={item} selected={item.id.toString() === selectedIdRef.current}>
                <Description selected={item.id.toString() === selectedIdRef.current}>
                  {childrenDescription(item)}
                </Description>
              </DisciplineItem>
            </Pressable>
          )
        })}
      </ServerResponseHandler>
    </Root>
  )
}

export default HomeScreen
