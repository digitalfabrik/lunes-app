import { useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { FlatList, Text } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { PlusIcon } from '../../assets/images'
import Header from '../components/Header'
import Loading from '../components/Loading'
import MenuItem from '../components/MenuItem'
import { DisciplineType } from '../constants/endpoints'
import labels from '../constants/labels.json'
import withCustomDisciplines from '../hocs/withCustomDisciplines'
import { useLoadDisciplines } from '../hooks/useLoadDisciplines'
import { RoutesParamsType } from '../navigation/NavigationTypes'

const Root = styled.View`
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
const StyledList = styled(FlatList as new () => FlatList<DisciplineType>)`
  width: 100%;
`

const Description = styled.Text<{ item: DisciplineType; selectedId: number | null }>`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${props =>
    props.item.id === props.selectedId ? props.theme.colors.white : props.theme.colors.lunesGreyMedium};
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

interface HomeScreenPropsType {
  navigation: StackNavigationProp<RoutesParamsType, 'Home'>
  customDisciplines: string[]
}

const HomeScreen = ({ navigation, customDisciplines }: HomeScreenPropsType): JSX.Element => {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { data: disciplines, error, loading } = useLoadDisciplines(null, customDisciplines)

  useFocusEffect(
    React.useCallback(() => {
      setSelectedId(-1)
    }, [])
  )

  const Title = (): JSX.Element => (
    <>
      <Header />
      <StyledText>{labels.home.welcome}</StyledText>
      <AddCustomDisciplineContainer onPress={navigateToAddCustomDisciplineScreen}>
        <PlusIcon />
        <AddCustomDisciplineText>{labels.home.addCustomDiscipline}</AddCustomDisciplineText>
      </AddCustomDisciplineContainer>
    </>
  )

  const Item = ({ item }: { item: DisciplineType }): JSX.Element | null => {
    if (item.numberOfChildren === 0) {
      return null
    }
    return (
      <MenuItem
        selected={item.id === selectedId}
        title={item.title}
        icon={item.icon}
        onPress={() => handleNavigation(item)}>
        <Description item={item} selectedId={selectedId}>
          {item.numberOfChildren} {item.numberOfChildren === 1 ? labels.home.unit : labels.home.units}
        </Description>
      </MenuItem>
    )
  }

  const handleNavigation = (item: DisciplineType): void => {
    setSelectedId(item.id)
    navigation.navigate('DisciplineSelection', {
      extraParams: {
        discipline: item
      }
    })
  }

  const navigateToAddCustomDisciplineScreen = (): void => {
    navigation.navigate('AddCustomDiscipline')
  }

  return (
    <Root>
      <Loading isLoading={loading}>
        <StyledList
          data={disciplines}
          ListHeaderComponent={Title}
          renderItem={Item}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={true}
          bounces={false}
        />
      </Loading>
      <Text>{error?.message}</Text>
    </Root>
  )
}

export default withCustomDisciplines(HomeScreen)
