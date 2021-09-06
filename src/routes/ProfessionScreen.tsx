import React, { ReactElement, useState } from 'react'
import Header from '../components/Header'
import MenuItem from '../components/MenuItem'
import { FlatList, Text } from 'react-native'
import axios from '../services/axios'
import { ENDPOINTS, ProfessionType } from '../constants/endpoints'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import { RouteProp, useFocusEffect } from '@react-navigation/native'
import Loading from '../components/Loading'
import { COLORS } from '../constants/colors'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import AsyncStorage from '../services/AsyncStorage'
import labels from '../constants/labels.json'
import styled from 'styled-components/native'

const Root = styled.View`
  background-color: ${COLORS.lunesWhite};
  height: 100%;
`
const TextStyle = styled.Text`
  margin-top: ${hp('8.5%')};
  text-align: center;
  font-size: ${wp('4%')};
  color: ${COLORS.lunesGreyMedium};
  font-family: 'SourceSansPro-Regular';
  margin-bottom: 32;
`
const List = styled.FlatList`
  width: ${wp('100%')};
` as unknown as typeof FlatList

const Description = styled.Text`
  font-size: ${wp('4%')};
  font-weight: normal;
  font-family: 'SourceSansPro-Regular';
  color: ${(prop: StyledProps) => (prop.item.id === prop.selectedId ? COLORS.white : COLORS.lunesGreyMedium)};
`
interface ProfessionScreenPropsType {
  route: RouteProp<RoutesParamsType, 'Profession'>
  navigation: StackNavigationProp<RoutesParamsType, 'Profession'>
}

interface StyledProps {
  selectedId: number | null
  item: ProfessionType
}

const ProfessionScreen = ({ navigation }: ProfessionScreenPropsType): JSX.Element => {
  const [professions, setProfessions] = useState<ProfessionType[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getSession()
        .then(async value => {
          if (value !== null) {
            navigation.navigate('WriteExercise', value)
          }
        })
        .catch(e => console.error(e))
      axios
        .get(ENDPOINTS.professions.all)
        .then(response => {
          setProfessions(response.data)
          setError(null)
        })
        .catch(e => {
          setError(e.message)
        })
        .finally(() => {
          setIsLoading(false)
        })
      setSelectedId(-1)
    }, [navigation])
  )
  const Title = (top: number | undefined): JSX.Element => (
    <>
      <Header top={top} />
      <TextStyle>{labels.home.welcome}</TextStyle>
    </>
  )
  const Item = ({ item }: { item: ProfessionType }): JSX.Element | null => {
    if (item.total_training_sets === 0) {
      return null
    }
    return (
      <MenuItem
        selected={item.id === selectedId}
        title={item.title}
        icon={item.icon}
        onPress={() => handleNavigation(item)}>
        <Description item={item} selectedId={selectedId}>
          {item.total_training_sets} {item.total_training_sets === 1 ? labels.home.unit : labels.home.units}
        </Description>
      </MenuItem>
    )
  }
  const handleNavigation = (item: ProfessionType): void => {
    setSelectedId(item.id)
    navigation.navigate('ProfessionSubcategory', {
      extraParams: {
        disciplineID: item.id,
        disciplineTitle: item.title,
        disciplineIcon: item.icon
      }
    })
  }
  return (
    <SafeAreaInsetsContext.Consumer>
      {insets => (
        <Root>
          <Loading isLoading={isLoading}>
            <List
              data={professions}
              ListHeaderComponent={Title(insets?.top)}
              renderItem={Item}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={true}
              bounces={false}></List>
          </Loading>
          <Text>{error}</Text>
        </Root>
      )}
    </SafeAreaInsetsContext.Consumer>
  )
}
export default ProfessionScreen
