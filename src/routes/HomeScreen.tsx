import { useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import styled from 'styled-components/native'

import { PlusIcon } from '../../assets/images'
import CustomDisciplineItem from '../components/CustomDisciplineItem'
import DisciplineItem from '../components/DisciplineItem'
import Header from '../components/Header'
import ServerResponseHandler from '../components/ServerResponseHandler'
import { DisciplineType } from '../constants/endpoints'
import labels from '../constants/labels.json'
import { useLoadDisciplines } from '../hooks/useLoadDisciplines'
import useReadCustomDisciplines from '../hooks/useReadCustomDisciplines'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import { childrenDescription } from '../services/helpers'

const Root = styled.ScrollView`
  background-color: ${props => props.theme.colors.lunesWhite};
  height: 100%;
`
const StyledText = styled.Text`
  margin-top: 50px;
  text-align: center;
  font-size: ${props => props.theme.fonts.defaultFontSize};
  color: ${props => props.theme.colors.lunesGreyMedium};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  margin-bottom: 32px;
`

const AddCustomDisciplineContainer = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 16px;
`

const AddCustomDisciplineText = styled.Text`
  text-transform: uppercase;
  padding-left: 10px;
  font-family: ${props => props.theme.fonts.contentFontBold};
`

const Description = styled.Text<{ selected: boolean }>`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${props => (props.selected ? props.theme.colors.white : props.theme.colors.lunesGreyMedium)};
`

interface HomeScreenPropsType {
  navigation: StackNavigationProp<RoutesParamsType, 'Home'>
}

const HomeScreen = ({ navigation }: HomeScreenPropsType): JSX.Element => {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { data: customDisciplines, refresh: refreshCustomDisciplines } = useReadCustomDisciplines()
  const { data: disciplines, error, loading, refresh } = useLoadDisciplines(null)

  useFocusEffect(
    React.useCallback(() => {
      setSelectedId(null)
      refreshCustomDisciplines()
    }, [refreshCustomDisciplines])
  )

  const handleNavigation = (item: DisciplineType): void => {
    setSelectedId(item.id.toString())
    navigation.navigate('DisciplineSelection', {
      discipline: item
    })
  }

  const navigateToAddCustomDisciplineScreen = (): void => {
    navigation.navigate('AddCustomDiscipline')
  }

  return (
    <Root>
      <Header />
      <StyledText>{labels.home.welcome}</StyledText>
      <AddCustomDisciplineContainer onPress={navigateToAddCustomDisciplineScreen}>
        <PlusIcon />
        <AddCustomDisciplineText>{labels.home.addCustomDiscipline}</AddCustomDisciplineText>
      </AddCustomDisciplineContainer>
      {customDisciplines?.map(customDiscipline => {
        return (
          <CustomDisciplineItem
            key={customDiscipline}
            apiKey={customDiscipline}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            navigation={navigation}
            refresh={refreshCustomDisciplines}
          />
        )
      })}
      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        {disciplines?.map(item => {
          if (item.numberOfChildren === 0) {
            return null
          }
          return (
            <DisciplineItem
              key={item.id}
              item={item}
              selected={item.id.toString() === selectedId}
              onPress={() => handleNavigation(item)}>
              <Description selected={item.id.toString() === selectedId}>{childrenDescription(item)}</Description>
            </DisciplineItem>
          )
        })}
      </ServerResponseHandler>
    </Root>
  )
}

export default HomeScreen
