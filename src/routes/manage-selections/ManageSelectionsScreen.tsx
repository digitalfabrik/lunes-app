import { useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { Subheading } from 'react-native-paper'
import styled from 'styled-components/native'

import AddElement from '../../components/AddElement'
import HorizontalLine from '../../components/HorizontalLine'
import { Heading } from '../../components/text/Heading'
import labels from '../../constants/labels.json'
import useReadCustomDisciplines from '../../hooks/useReadCustomDisciplines'
import useReadSelectedProfessions from '../../hooks/useReadSelectedProfessions'
import { RoutesParams } from '../../navigation/NavigationTypes'
import AsyncStorage from '../../services/AsyncStorage'
import { reportError } from '../../services/sentry'
import SelectionItem from './components/SelectionItem'
import RouteWrapper from '../../components/RouteWrapper'

const Root = styled.ScrollView`
  display: flex;
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacings.md};
`

const SectionHeading = styled(Subheading)`
  padding-top: ${props => props.theme.spacings.xl};
`

const Padding = styled.View`
  padding-bottom: ${props => props.theme.spacings.xxl};
`

interface Props {
  navigation: StackNavigationProp<RoutesParams, 'ManageSelection'>
}

const ManageSelectionsScreen = ({ navigation }: Props): ReactElement => {
  const { data: selectedProfessions, refresh: refreshSelectedProfessions } = useReadSelectedProfessions()
  const { data: customDisciplines, refresh: refreshCustomDisciplines } = useReadCustomDisciplines()

  useFocusEffect(refreshCustomDisciplines)
  useFocusEffect(refreshSelectedProfessions)

  const professionItems = selectedProfessions?.map(id => {
    const unselectProfessionAndRefresh = () => {
      AsyncStorage.removeSelectedProfession(id).then(refreshSelectedProfessions).catch(reportError)
    }
    return <SelectionItem key={id} identifier={{ disciplineId: id }} deleteItem={unselectProfessionAndRefresh} />
  })

  const customDisciplineItems = customDisciplines?.map(apiKey => {
    const deleteCustomDisciplineAndRefresh = () => {
      AsyncStorage.removeCustomDiscipline(apiKey).then(refreshCustomDisciplines).catch(reportError)
    }
    return <SelectionItem key={apiKey} identifier={{ apiKey }} deleteItem={deleteCustomDisciplineAndRefresh} />
  })

  const navigateToProfessionSelection = () => {
    navigation.navigate('ScopeSelection', { initialSelection: false })
  }

  const navigateToAddCustomDiscipline = () => {
    navigation.navigate('AddCustomDiscipline')
  }

  return (
    <RouteWrapper>
      <Root contentContainerStyle={{ flexGrow: 1 }}>
        <Heading>{labels.manageSelection.heading}</Heading>
        <SectionHeading>{labels.manageSelection.yourProfessions}</SectionHeading>
        <HorizontalLine />
        {professionItems}
        <AddElement onPress={navigateToProfessionSelection} label={labels.manageSelection.addProfession} />

        <SectionHeading>{labels.manageSelection.yourCustomDisciplines}</SectionHeading>
        <HorizontalLine />
        {customDisciplineItems}

        <AddElement
          onPress={navigateToAddCustomDiscipline}
          label={labels.home.addCustomDiscipline}
          explanation={labels.manageSelection.descriptionAddCustomDiscipline}
        />
        <Padding />
      </Root>
    </RouteWrapper>
  )
}

export default ManageSelectionsScreen
