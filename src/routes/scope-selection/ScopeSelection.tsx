import React, { useMemo } from 'react'
import styled, { useTheme } from 'styled-components/native'

import DisciplineListItem from '../../components/DisciplineListItem'
import SearchBar from '../../components/SearchBar'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import { ContentTextBold, ContentTextLight } from '../../components/text/Content'
import { Discipline } from '../../constants/endpoints'
import { formatDiscipline } from '../../hooks/helpers'
import { useLoadAllDisciplines } from '../../hooks/useLoadAllDisciplines'
import { useLoadDisciplines } from '../../hooks/useLoadDisciplines'
import useStorage, { useStorageCache } from '../../hooks/useStorage'
import { getLabels, searchProfessions, splitTextBySearchString } from '../../services/helpers'
import { pushSelectedProfession, removeSelectedProfession } from '../../services/storageUtils'

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

const DisciplineContainer = styled.View`
  margin: 0 ${props => props.theme.spacings.sm};
`

const HighlightContainer = styled.Text<{ disabled: boolean }>`
  flex-direction: row;
  color: ${props => (props.disabled ? props.theme.colors.disabled : props.theme.colors.black)};
`

const highlightText = (textArray: [string] | [string, string, string], disabled: boolean): JSX.Element => (
  <HighlightContainer disabled={disabled}>
    <ContentTextLight>{textArray[0]}</ContentTextLight>
    <ContentTextBold>{textArray[1]}</ContentTextBold>
    <ContentTextLight>{textArray[2]}</ContentTextLight>
  </HighlightContainer>
)

type FilteredProfessionListProps = {
  queryTerm: string
}

const FilteredProfessionList = ({ queryTerm }: FilteredProfessionListProps): JSX.Element => {
  const storageCache = useStorageCache()
  const [selectedProfessions] = useStorage('selectedProfessions')
  const allProfessions = useLoadAllDisciplines()
    .data?.filter(discipline => discipline.total_discipline_children === 0)
    .map(discipline => formatDiscipline(discipline, {}))
  const filteredProfessions = useMemo(() => searchProfessions(allProfessions, queryTerm), [allProfessions, queryTerm])

  return (
    <ScopeContainer>
      {filteredProfessions?.map(profession => {
        const disabled = !!selectedProfessions?.includes(profession.id)
        return (
          <StyledPressable
            key={profession.id}
            onPress={async () => {
              if (selectedProfessions?.includes(profession.id)) {
                await removeSelectedProfession(storageCache, profession.id)
              } else {
                await pushSelectedProfession(storageCache, profession.id)
              }
            }}>
            {highlightText(splitTextBySearchString(profession.title, queryTerm), disabled)}
          </StyledPressable>
        )
      })}
    </ScopeContainer>
  )
}

type ScopeSelectionProps = {
  queryTerm: string
  setQueryTerm: (newString: string) => void
  navigateToDiscipline: (item: Discipline) => void
}

const ScopeSelection = ({ queryTerm, setQueryTerm, navigateToDiscipline }: ScopeSelectionProps): JSX.Element => {
  const { data: disciplines, error, loading, refresh } = useLoadDisciplines({ parent: null })
  const theme = useTheme()

  const disciplineItems = disciplines?.map(item => (
    <DisciplineListItem key={item.id} item={item} onPress={() => navigateToDiscipline(item)} hasBadge={false} />
  ))

  return (
    <>
      <SearchContainer>
        <SearchBar
          query={queryTerm}
          setQuery={setQueryTerm}
          placeholder={getLabels().scopeSelection.searchProfession}
          style={{
            backgroundColor: theme.colors.background,
          }}
        />
      </SearchContainer>
      {queryTerm.length > 0 ? (
        <FilteredProfessionList queryTerm={queryTerm} />
      ) : (
        <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
          <DisciplineContainer>{disciplineItems}</DisciplineContainer>
        </ServerResponseHandler>
      )}
    </>
  )
}

export default ScopeSelection
