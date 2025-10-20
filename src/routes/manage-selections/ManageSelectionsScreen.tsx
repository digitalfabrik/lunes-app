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
import { removeCustomDiscipline, removeSelectedJob } from '../../services/storageUtils'
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
  const [selectedJobs] = useStorage('selectedJobs')

  const jobItems = selectedJobs?.map(id => {
    const unselectJobAndRefresh = () => {
      removeSelectedJob(storageCache, id).catch(reportError)
    }
    return <SelectionItem key={id} identifier={{ disciplineId: id }} deleteItem={unselectJobAndRefresh} />
  })

  const navigateToScopeSelection = () => {
    navigation.navigate('JobSelection', { initialSelection: false })
  }

  return (
    <RouteWrapper>
      <Root contentContainerStyle={{ flexGrow: 1 }}>
        <StyledHeading>{getLabels().manageSelection.heading}</StyledHeading>
        <SectionHeading>{getLabels().manageSelection.yourJobs}</SectionHeading>
        <HorizontalLine />
        {jobItems}
        <AddElement onPress={navigateToScopeSelection} label={getLabels().manageSelection.addJob} />
        <Padding />
      </Root>
    </RouteWrapper>
  )
}

export default ManageSelectionsScreen
