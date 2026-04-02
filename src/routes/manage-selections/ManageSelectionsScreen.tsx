import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import AddElement from '../../components/AddElement'
import Button from '../../components/Button'
import HorizontalLine from '../../components/HorizontalLine'
import RouteWrapper from '../../components/RouteWrapper'
import { HeadingText } from '../../components/text/Heading'
import { SubheadingPrimary, SubheadingText } from '../../components/text/Subheading'
import { BUTTONS_THEME } from '../../constants/data'
import useStorage, { useStorageCache } from '../../hooks/useStorage'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels } from '../../services/helpers'
import { reportError } from '../../services/sentry'
import { removeSelectedJob } from '../../services/storageUtils'
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

const EmptyStateContainer = styled.View`
  align-items: center;
  padding: ${props => props.theme.spacings.lg} 0;
`

const EmptyStateTitle = styled(SubheadingPrimary)`
  text-align: center;
  margin-bottom: ${props => props.theme.spacings.xs};
`

const EmptyStateSubtitle = styled.Text`
  color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${props => props.theme.fonts.defaultFontSize};
  text-align: center;
  margin-bottom: ${props => props.theme.spacings.md};
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
      removeSelectedJob(storageCache, { id, type: 'standard' }).catch(reportError)
    }
    return <SelectionItem key={id} identifier={{ id, type: 'standard' }} deleteItem={unselectJobAndRefresh} />
  })

  const navigateToScopeSelection = () => {
    navigation.navigate('JobSelection', { initialSelection: false })
  }

  return (
    <RouteWrapper>
      <Root contentContainerStyle={{ flexGrow: 1 }}>
        <StyledHeading>{getLabels().manageJobs.heading}</StyledHeading>
        <SectionHeading>{getLabels().manageJobs.yourJobs}</SectionHeading>
        <HorizontalLine />
        {jobItems?.length ? (
          <>
            {jobItems}
            <AddElement onPress={navigateToScopeSelection} label={getLabels().manageJobs.addJob} />
          </>
        ) : (
          <EmptyStateContainer>
            <EmptyStateTitle>{getLabels().manageJobs.emptyState.title}</EmptyStateTitle>
            <EmptyStateSubtitle>{getLabels().manageJobs.emptyState.subtitle}</EmptyStateSubtitle>
            <Button
              testID='add-job-button'
              onPress={navigateToScopeSelection}
              label={getLabels().manageJobs.addJob}
              buttonTheme={BUTTONS_THEME.contained}
            />
          </EmptyStateContainer>
        )}
        <Padding />
      </Root>
    </RouteWrapper>
  )
}

export default ManageSelectionsScreen
