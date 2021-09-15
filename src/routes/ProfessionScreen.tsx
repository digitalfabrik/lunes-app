import React, { ReactElement, useState } from 'react'
import Header from '../components/Header'
import MenuItem from '../components/MenuItem'
import { FlatList, Text } from 'react-native'
import { DisciplineType } from '../constants/endpoints'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import AsyncStorage from '../services/AsyncStorage'
import Loading from '../components/Loading'
import { COLORS } from '../constants/theme/colors'
import labels from '../constants/labels.json'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'
import { useLoadDisciplines } from '../hooks/useLoadDisciplines'

const Root = styled.View`
  background-color: ${COLORS.lunesWhite};
  height: 100%;
`
const StyledText = styled.Text`
  margin-top: 8.5%;
  text-align: center;
  font-size: ${wp('4%')}px;
  color: ${COLORS.lunesGreyMedium};
  font-family: 'SourceSansPro-Regular';
  margin-bottom: 32px;
`
const StyledList = styled(FlatList as new () => FlatList<DisciplineType>)`
  width: 100%;
`

const Description = styled.Text`
  font-size: ${wp('4%')}px;
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
  item: DisciplineType
}

const ProfessionScreen = ({ navigation, route }: ProfessionScreenPropsType): ReactElement => {
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
