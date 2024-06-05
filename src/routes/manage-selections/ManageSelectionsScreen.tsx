import { useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import AddElement from '../../components/AddElement'
import HorizontalLine from '../../components/HorizontalLine'
import RouteWrapper from '../../components/RouteWrapper'
import { HeadingText } from '../../components/text/Heading'
import { SubheadingText } from '../../components/text/Subheading'
import useReadCustomDisciplines from '../../hooks/useReadCustomDisciplines'
import useReadSelectedProfessions from '../../hooks/useReadSelectedProfessions'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { removeCustomDiscipline, removeSelectedProfession } from '../../services/AsyncStorage'
import { getLabels } from '../../services/helpers'
import { reportError } from '../../services/sentry'
import SelectionItem from './components/SelectionItem'

const Root = styled.ScrollView`
  display: flex;
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacings.md};
`

const SectionHeading = styled(SubheadingText)`
  padding-top: ${props => props.theme.spacings.xl};
`

const Padding = styled.View`
  padding-bottom: ${props => props.theme.spacings.xxl};
`

const StyledHeading = styled(HeadingText)`
  text-align: center;
`

type ManageSelectionScreenProps = {
  navigation: StackNavigationProp<RoutesParams, 'ManageSelection'>
}

const ManageSelectionsScreen = ({ navigation }: ManageSelectionScreenProps): ReactElement => {
  const { data: selectedProfessions, refresh: refreshSelectedProfessions } = useReadSelectedProfessions()
  const { data: customDisciplines, refresh: refreshCustomDisciplines } = useReadCustomDisciplines()

  useFocusEffect(refreshCustomDisciplines)
  useFocusEffect(refreshSelectedProfessions)

  const professionItems = selectedProfessions?.map(id => {
    const unselectProfessionAndRefresh = () => {
      removeSelectedProfession(id).then(refreshSelectedProfessions).catch(reportError)
    }
    return <SelectionItem key={id} identifier={{ disciplineId: id }} deleteItem={unselectProfessionAndRefresh} />
  })

  const customDisciplineItems = customDisciplines?.map(apiKey => {
    const deleteCustomDisciplineAndRefresh = () => {
      removeCustomDiscipline(apiKey).then(refreshCustomDisciplines).catch(reportError)
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
        <StyledHeading>{getLabels().manageSelection.heading}</StyledHeading>
        <SectionHeading>{getLabels().manageSelection.yourProfessions}</SectionHeading>
        <HorizontalLine />
        {professionItems}
        <AddElement onPress={navigateToProfessionSelection} label={getLabels().manageSelection.addProfession} />

        <SectionHeading>{getLabels().manageSelection.yourCustomDisciplines}</SectionHeading>
        <HorizontalLine />
        {customDisciplineItems}

        <AddElement
          onPress={navigateToAddCustomDiscipline}
          label={getLabels().home.addCustomDiscipline}
          explanation={getLabels().manageSelection.descriptionAddCustomDiscipline}
        />
        <Padding />
      </Root>
    </RouteWrapper>
  )
}

export default ManageSelectionsScreen
