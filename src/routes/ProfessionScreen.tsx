import { useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { FlatList, Text } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import Header from '../components/Header'
import Loading from '../components/Loading'
import MenuItem from '../components/MenuItem'
import { DisciplineType } from '../constants/endpoints'
import labels from '../constants/labels.json'
import { useLoadDisciplines } from '../hooks/useLoadDisciplines'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import AsyncStorage from '../services/AsyncStorage'

const Root = styled.View`
  background-color: ${props => props.theme.colors.lunesWhite};
  height: 100%;
`
const StyledText = styled.Text`
  margin-top: 8.5%;
  text-align: center;
  font-size: ${wp('4%')}px;
  color: ${props => props.theme.colors.lunesGreyMedium};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  margin-bottom: 32px;
`
const StyledList = styled(FlatList as new () => FlatList<DisciplineType>)`
  width: 100%;
`

const Description = styled.Text<{ item: DisciplineType; selectedId: number | null }>`
  font-size: ${wp('4%')}px;
  font-weight: normal;
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${props =>
    props.item.id === props.selectedId ? props.theme.colors.white : props.theme.colors.lunesGreyMedium};
`

interface ProfessionScreenPropsType {
  navigation: StackNavigationProp<RoutesParamsType, 'Profession'>
}

const ProfessionScreen = ({ navigation }: ProfessionScreenPropsType): JSX.Element => {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { data: disciplines, error, loading } = useLoadDisciplines(null)

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getSession()
        .then(async value => {
          if (value !== null) {
            navigation.navigate('WriteExercise', value)
          }
        })
        .catch(e => console.error(e))
      setSelectedId(-1)
    }, [navigation])
  )
  const Title = (top: number | undefined): JSX.Element => (
    <>
      <Header top={top} />
      <StyledText>{labels.home.welcome}</StyledText>
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
    navigation.navigate('ProfessionSubcategory', {
      extraParams: {
        module: item
      }
    })
  }
  return (
    <SafeAreaInsetsContext.Consumer>
      {insets => (
        <Root>
          <Loading isLoading={loading}>
            <StyledList
              data={disciplines}
              ListHeaderComponent={Title(insets?.top)}
              renderItem={Item}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={true}
              bounces={false}
            />
          </Loading>
          <Text>{error}</Text>
        </Root>
      )}
    </SafeAreaInsetsContext.Consumer>
  )
}
export default ProfessionScreen
