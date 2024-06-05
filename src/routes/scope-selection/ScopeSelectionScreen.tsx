import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import normalize from 'normalize-strings'
import React, { useLayoutEffect, useMemo, useState } from 'react'
import { ScrollView } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import Button from '../../components/Button'
import DisciplineListItem from '../../components/DisciplineListItem'
import Header from '../../components/Header'
import RouteWrapper from '../../components/RouteWrapper'
import SearchBar from '../../components/SearchBar'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import { ContentSecondary, ContentTextBold, ContentTextLight } from '../../components/text/Content'
import { Heading } from '../../components/text/Heading'
import { BUTTONS_THEME } from '../../constants/data'
import { Discipline } from '../../constants/endpoints'
import { formatDiscipline } from '../../hooks/helpers'
import { useLoadAllDisciplines } from '../../hooks/useLoadAllDisciplines'
import { useLoadDisciplines } from '../../hooks/useLoadDisciplines'
import useReadSelectedProfessions from '../../hooks/useReadSelectedProfessions'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { pushSelectedProfession, setSelectedProfessions } from '../../services/AsyncStorage'
import { getLabels, splitTextBySearchString } from '../../services/helpers'

const HighlightContainer = styled.Text<{ disabled: boolean }>`
  flex-direction: row;
  color: ${props => (props.disabled ? props.theme.colors.disabled : props.theme.colors.black)};
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
  padding: ${props => props.theme.spacings.xs} 0;
  background-color: ${props => props.theme.colors.background};
`

const StyledPressable = styled.Pressable`
  padding: ${props => props.theme.spacings.sm};
  border-bottom: 1px solid ${props => props.theme.colors.disabled};
`

const ButtonContainer = styled.View`
  margin: ${props => props.theme.spacings.md} auto;
`

export const searchProfessions = (disciplines: Discipline[] | undefined, searchKey: string): Discipline[] | undefined =>
  disciplines?.filter(discipline =>
    normalize(discipline.title).toLowerCase().includes(normalize(searchKey.toLowerCase())),
  )

const highlightText = (textArray: [string] | [string, string, string], disabled: boolean): JSX.Element => (
  <HighlightContainer disabled={disabled}>
    <ContentTextLight>{textArray[0]}</ContentTextLight>
    <ContentTextBold>{textArray[1]}</ContentTextBold>
    <ContentTextLight>{textArray[2]}</ContentTextLight>
  </HighlightContainer>
)

type IntroScreenProps = {
  route: RouteProp<RoutesParams, 'ScopeSelection'>
  navigation: StackNavigationProp<RoutesParams, 'ScopeSelection'>
}

const ScopeSelectionScreen = ({ navigation, route }: IntroScreenProps): JSX.Element => {
  const { initialSelection } = route.params
  const { data: disciplines, error, loading, refresh } = useLoadDisciplines({ parent: null })
  const { data: selectedProfessions, refresh: refreshSelectedProfessions } = useReadSelectedProfessions()
  const allProfessions = useLoadAllDisciplines()
    .data?.filter(discipline => discipline.total_discipline_children === 0)
    .map(discipline => formatDiscipline(discipline, {}))
  const [searchString, setSearchString] = useState<string>('')
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false)
  const filteredProfessions = useMemo(
    () => searchProfessions(allProfessions, searchString),
    [allProfessions, searchString],
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

  const disciplineItems = disciplines?.map(item => (
    <DisciplineListItem key={item.id} item={item} onPress={() => navigateToDiscipline(item)} hasBadge={false} />
  ))

  return (
    <RouteWrapper
      backgroundColor={initialSelection ? theme.colors.primary : theme.colors.background}
      lightStatusBarContent={initialSelection}>
      <ScrollView>
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
            style={{
              backgroundColor: theme.colors.background,
            }}
          />
        </SearchContainer>
        {showSearchResults ? (
          <ScopeContainer>
            {filteredProfessions?.map(profession => {
              const disabled = !!selectedProfessions?.includes(profession.id)
              return (
                <StyledPressable
                  key={profession.id}
                  onPress={async () => {
                    await pushSelectedProfession(profession.id).then(() => {
                      navigation.navigate('ManageSelection')
                    })
                  }}
                  disabled={disabled}>
                  {highlightText(splitTextBySearchString(profession.title, searchString), disabled)}
                </StyledPressable>
              )
            })}
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
      </ScrollView>
    </RouteWrapper>
  )
}

export default ScopeSelectionScreen
