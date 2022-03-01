import { useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
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

interface HomeScreenProps {
  navigation: StackNavigationProp<RoutesParams, 'Home'>
}

const HomeScreen = ({ navigation }: HomeScreenProps): JSX.Element => {
  const { data: customDisciplines, refresh: refreshCustomDisciplines } = useReadCustomDisciplines()
  const { data: disciplines, error, loading, refresh } = useLoadDisciplines(null)

  useFocusEffect(
    React.useCallback(() => {
      refreshCustomDisciplines()
    }, [refreshCustomDisciplines])
  )

  const navigateToDiscipline = (item: Discipline): void => {
    navigation.navigate('DisciplineSelection', {
      discipline: item
    })
  }

  const navigateToAddCustomDisciplineScreen = (): void => {
    navigation.navigate('AddCustomDiscipline')
  }

  const customDisciplineItems = customDisciplines?.map(customDiscipline => (
    <CustomDisciplineItem
      key={customDiscipline}
      apiKey={customDiscipline}
      navigation={navigation}
      refresh={refreshCustomDisciplines}
    />
  ))

  const disciplineItems = disciplines
    ?.filter(it => it.numberOfChildren > 0)
    ?.map(item => (
      <DisciplineItem
        key={item.id}
        title={item.title}
        icon={item.icon}
        onPress={() => navigateToDiscipline(item)}
        description={childrenDescription(item)}
      />
    ))

  return (
    <Root>
      <Header />
      <StyledText>{labels.home.welcome}</StyledText>
      <AddCustomDisciplineContainer onPress={navigateToAddCustomDisciplineScreen}>
        <AddCircleIcon width={wp('8%')} height={wp('8%')} />
        <AddCustomDisciplineText>{labels.home.addCustomDiscipline}</AddCustomDisciplineText>
      </AddCustomDisciplineContainer>
      {customDisciplineItems}
      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        {disciplineItems}
      </ServerResponseHandler>
    </Root>
  )
}

export default HomeScreen
