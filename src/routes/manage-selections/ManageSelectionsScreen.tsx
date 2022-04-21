import { useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useCallback } from 'react'
import { Subheading } from 'react-native-paper'
import styled from 'styled-components/native'

import { CloseIconRed } from '../../../assets/images'
import AddElement from '../../components/AddElement'
import HorizontalLine from '../../components/HorizontalLine'
import ListItem from '../../components/ListItem'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import { Heading } from '../../components/text/Heading'
import { Discipline } from '../../constants/endpoints'
import labels from '../../constants/labels.json'
import useReadCustomDisciplines from '../../hooks/useReadCustomDisciplines'
import useReadSelectedProfessions from '../../hooks/useReadSelectedProfessions'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { removeSelectedProfession } from '../../services/AsyncStorage'
import { reportError } from '../../services/sentry'
import CustomDisciplineItem from './components/CustomDisciplineItem'

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

const CloseIconContainer = styled.Pressable`
  padding-right: ${props => props.theme.spacings.sm};
`

interface Props {
  navigation: StackNavigationProp<RoutesParams, 'ManageDisciplines'>
}

const ManageSelectionsScreen = ({ navigation }: Props): ReactElement => {
  const {
    data: selectedProfessions,
    loading,
    error,
    refresh: refreshSelectedProfessions
  } = useReadSelectedProfessions()
  const { data: customDisciplines, refresh: refreshCustomDisciplines } = useReadCustomDisciplines()

  const refresh = useCallback(() => {
    refreshCustomDisciplines()
    refreshSelectedProfessions()
  }, [refreshCustomDisciplines, refreshSelectedProfessions])

  useFocusEffect(refresh)

  const Item = ({ item }: { item: Discipline }): JSX.Element => {
    const unselectProfessionAndRefresh = (item: Discipline) => {
      removeSelectedProfession(item).then(refreshSelectedProfessions).catch(reportError)
    }
    return (
      <ListItem
        icon={item.icon}
        title={item.title}
        rightChildren={
          <CloseIconContainer onPress={() => unselectProfessionAndRefresh(item)} testID='delete-icon'>
            <CloseIconRed />
          </CloseIconContainer>
        }
      />
    )
  }

  const navigateToProfessionSelection = () => {
    navigation.navigate('ScopeSelection', { initialSelection: false })
  }

  const navigateToAddCustomDiscipline = () => {
    navigation.navigate('AddCustomDiscipline')
  }

  return (
    <Root contentContainerStyle={{ flexGrow: 1 }}>
      <Heading>{labels.manageDisciplines.heading}</Heading>
      <SectionHeading>{labels.manageDisciplines.yourProfessions}</SectionHeading>
      <HorizontalLine />
      <ServerResponseHandler error={error} loading={loading} refresh={refreshSelectedProfessions}>
        {selectedProfessions?.map(profession => (
          <Item key={profession.id} item={profession} />
        ))}
      </ServerResponseHandler>
      <AddElement onPress={navigateToProfessionSelection} label={labels.manageDisciplines.addProfession} />

      <SectionHeading>{labels.manageDisciplines.yourCustomDisciplines}</SectionHeading>
      <HorizontalLine />
      <ServerResponseHandler error={error} loading={loading} refresh={refreshCustomDisciplines}>
        {customDisciplines?.map(customDiscipline => (
          <CustomDisciplineItem key={customDiscipline} refresh={refreshCustomDisciplines} apiKey={customDiscipline} />
        ))}
      </ServerResponseHandler>

      <AddElement
        onPress={navigateToAddCustomDiscipline}
        label={labels.home.addCustomDiscipline}
        explanation={labels.manageDisciplines.descriptionAddCustomDiscipline}
      />
      <Padding />
    </Root>
  )
}

export default ManageSelectionsScreen
