import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import normalize from 'normalize-strings'
import React, { useLayoutEffect, useMemo, useState } from 'react'
import { Pressable, Text } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import Button from '../../components/Button'
import DisciplineListItem from '../../components/DisciplineListItem'
import Header from '../../components/Header'
import HorizontalLine from '../../components/HorizontalLine'
import RouteWrapper from '../../components/RouteWrapper'
import SearchBar from '../../components/SearchBar'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import { ContentSecondary } from '../../components/text/Content'
import { Heading } from '../../components/text/Heading'
import { BUTTONS_THEME } from '../../constants/data'
import { Discipline } from '../../constants/endpoints'
import { useLoadDisciplines } from '../../hooks/useLoadDisciplines'
import useReadSelectedProfessions from '../../hooks/useReadSelectedProfessions'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { pushSelectedProfession, setSelectedProfessions } from '../../services/AsyncStorage'
import { getLabels, splitTextBySearchString } from '../../services/helpers'

const HighlightContainer = styled.View`
  flex-direction: row;
`

const BoldText = styled.Text`
  font-weight: bold;
`

const StyledScrollView = styled.ScrollView`
  background-color: ${props => props.theme.colors.background};
`

const TextContainer = styled.View`
  margin-top: ${props => props.theme.spacings.xxl};
  margin-bottom: ${props => props.theme.spacings.lg};
`

const StyledText = styled(ContentSecondary)`
  text-align: center;
`

const SearchContainer = styled.View`
  margin: ${props => props.theme.spacings.sm};
`

const ScopeContainer = styled.View`
  margin: 0 ${props => props.theme.spacings.sm};
`

const ButtonContainer = styled.View`
  margin: ${props => props.theme.spacings.md} auto;
`

export const searchProfessions = (disciplines: Discipline[] | null, searchKey: string): Discipline[] | undefined =>
  disciplines?.filter(discipline =>
    normalize(discipline.title).toLowerCase().includes(normalize(searchKey.toLowerCase()))
  )

type IntroScreenProps = {
  route: RouteProp<RoutesParams, 'ScopeSelection'>
  navigation: StackNavigationProp<RoutesParams, 'ScopeSelection'>
}

const ScopeSelectionScreen = ({ navigation, route }: IntroScreenProps): JSX.Element => {
  const { initialSelection } = route.params
  const { data: disciplines, error, loading, refresh } = useLoadDisciplines({ parent: null })
  const { data: selectedProfessions, refresh: refreshSelectedProfessions } = useReadSelectedProfessions()
  const { data: allProfessions } = useLoadDisciplines({ parent: null, allLevels: true })
  const [searchString, setSearchString] = useState<string>('')
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false)
  const filteredProfessions = useMemo(
    () => searchProfessions(allProfessions, searchString),
    [allProfessions, searchString]
  )
  const theme = useTheme()

  useFocusEffect(refreshSelectedProfessions)

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: !initialSelection })
  })

  const navigateToDiscipline = (item: Discipline): void => {
    navigation.navigate('ProfessionSelection', {
      discipline: item,
      initialSelection,
    })
  }

  const navigateToHomeScreen = async () => {
    if (selectedProfessions === null) {
      await setSelectedProfessions([])
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'BottomTabNavigator' }],
    })
  }

  const highlightText = (textArray: [string] | [string, string, string]): JSX.Element => (
    <HighlightContainer>
      <Text>{textArray[0]}</Text>
      <BoldText>{textArray[1]}</BoldText>
      <Text>{textArray[2]}</Text>
    </HighlightContainer>
  )

  const disciplineItems = disciplines?.map(item => (
    <DisciplineListItem key={item.id} item={item} onPress={() => navigateToDiscipline(item)} hasBadge={false} />
  ))

  return (
    <RouteWrapper
      backgroundColor={initialSelection ? theme.colors.primary : theme.colors.background}
      lightStatusBarContent={initialSelection}>
      <StyledScrollView>
        {initialSelection && <Header />}

        <TextContainer>
          {initialSelection ? (
            <StyledText>{getLabels().scopeSelection.welcome}</StyledText>
          ) : (
            <Heading centered>{getLabels().manageSelection.addProfession}</Heading>
          )}
          <StyledText>{getLabels().scopeSelection.selectProfession}</StyledText>
        </TextContainer>
        <SearchContainer>
          <SearchBar
            query={searchString}
            setQuery={input => {
              setSearchString(input)
              setShowSearchResults(input.length > 0)
            }}
            placeholder={getLabels().scopeSelection.searchProfession}
          />
        </SearchContainer>
        {showSearchResults ? (
          <ScopeContainer>
            {filteredProfessions?.map(profession => (
              <Pressable
                key={profession.id}
                onPress={async () => {
                  await pushSelectedProfession(profession.id).then(() => {
                    navigation.navigate('ManageSelection')
                  })
                }}>
                {highlightText(splitTextBySearchString(profession.title, searchString))}
                <Text>{profession.parentTitle}</Text>
                <HorizontalLine />
              </Pressable>
            ))}
          </ScopeContainer>
        ) : (
          <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
            <ScopeContainer>{disciplineItems}</ScopeContainer>
          </ServerResponseHandler>
        )}
        {initialSelection && (
          <ButtonContainer>
            <Button
              onPress={navigateToHomeScreen}
              label={
                selectedProfessions && selectedProfessions.length > 0
                  ? getLabels().scopeSelection.confirmSelection
                  : getLabels().scopeSelection.skipSelection
              }
              buttonTheme={BUTTONS_THEME.contained}
            />
          </ButtonContainer>
        )}
      </StyledScrollView>
    </RouteWrapper>
  )
}

export default ScopeSelectionScreen
