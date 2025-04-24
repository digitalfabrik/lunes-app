import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import AddElement from '../../components/AddElement'
import HorizontalLine from '../../components/HorizontalLine'
import RouteWrapper from '../../components/RouteWrapper'
import { HeadingText } from '../../components/text/Heading'
import { SubheadingText } from '../../components/text/Subheading'
import useStorage, { useStorageCache } from '../../hooks/useStorage'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels } from '../../services/helpers'
import { reportError } from '../../services/sentry'
import { removeCustomDiscipline, removeSelectedProfession } from '../../services/storageUtils'
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
  const storageCache = useStorageCache()
  const [selectedProfessions] = useStorage('selectedProfessions')
  const [customDisciplines] = useStorage('customDisciplines')

  const professionItems = selectedProfessions?.map(id => {
    const unselectProfessionAndRefresh = () => {
      removeSelectedProfession(storageCache, id).catch(reportError)
    }
    return <SelectionItem key={id} identifier={{ disciplineId: id }} deleteItem={unselectProfessionAndRefresh} />
  })

  const customDisciplineItems = customDisciplines.map(apiKey => {
    const deleteCustomDisciplineAndRefresh = async () => {
      await removeCustomDiscipline(storageCache, apiKey)
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
