import React, { useMemo, ReactElement } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { CheckCircleIconGreen } from '../../../assets/images'
import DisciplineListItem from '../../components/DisciplineListItem'
import SearchBar from '../../components/SearchBar'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import { ContentTextBold, ContentTextLight } from '../../components/text/Content'
import { Discipline } from '../../constants/endpoints'
import useLoadAllJobs from '../../hooks/useLoadAllJobs'
import useStorage, { useStorageCache } from '../../hooks/useStorage'
import { getLabels, searchJobs, splitTextBySearchString } from '../../services/helpers'
import { pushSelectedJob, removeSelectedJob } from '../../services/storageUtils'

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

const EmptyListIndicator = styled.Text`
  font-size: ${props => props.theme.fonts.largeFontSize};
  font-family: ${props => props.theme.fonts.contentFontBold};
  text-align: center;
`

const IconContainer = styled.View`
  margin-right: ${props => props.theme.spacings.sm};
`

const highlightText = (textArray: [string] | [string, string, string], disabled: boolean): ReactElement => (
  <HighlightContainer disabled={disabled}>
    <ContentTextLight>{textArray[0]}</ContentTextLight>
    <ContentTextBold>{textArray[1]}</ContentTextBold>
    <ContentTextLight>{textArray[2]}</ContentTextLight>
  </HighlightContainer>
)

type FilteredJobListProps = {
  queryTerm: string
}

const FilteredJobList = ({ queryTerm }: FilteredJobListProps): ReactElement => {
  const storageCache = useStorageCache()
  const [selectedJobs] = useStorage('selectedJobs')

  const { data: allJobs, loading, error, refresh } = useLoadAllJobs()
  const filteredJobs = useMemo(() => searchJobs(allJobs, queryTerm), [allJobs, queryTerm])

  return (
    <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
      <ScopeContainer>
        {filteredJobs?.map(job => {
          const disabled = !!selectedJobs?.includes(job.id)
          return (
            <StyledPressable
              key={job.id}
              onPress={async () => {
                if (selectedJobs?.includes(job.id)) {
                  await removeSelectedJob(storageCache, job.id)
                } else {
                  await pushSelectedJob(storageCache, job.id)
                }
              }}>
              {highlightText(splitTextBySearchString(job.title, queryTerm), disabled)}
            </StyledPressable>
          )
        })}
        {filteredJobs !== undefined && filteredJobs.length === 0 && (
          <EmptyListIndicator>{getLabels().scopeSelection.noJobsFound}</EmptyListIndicator>
        )}
      </ScopeContainer>
    </ServerResponseHandler>
  )
}

type JobSelectionProps = {
  queryTerm: string
  setQueryTerm: (newString: string) => void
  onSelectJob: (job: Discipline) => void
  onUnselectJob?: (job: Discipline) => void
}

const JobSelection = ({ queryTerm, setQueryTerm, onSelectJob, onUnselectJob }: JobSelectionProps): ReactElement => {
  const { data: disciplines, error, loading, refresh } = useLoadAllJobs()
  const theme = useTheme()
  const [selectedJobs] = useStorage('selectedJobs')

  const disciplineItems = disciplines?.map(item => {
    const isSelected = selectedJobs?.includes(item.id)
    return (
      <DisciplineListItem
        key={item.id}
        item={item}
        onPress={() => {
          if (isSelected) {
            onUnselectJob?.(item)
          } else {
            onSelectJob(item)
          }
        }}
        disabled={isSelected && !onUnselectJob}
        rightChildren={<IconContainer>{isSelected && <CheckCircleIconGreen testID='check-icon' />}</IconContainer>}
      />
    )
  })

  return (
    <>
      <SearchContainer>
        <SearchBar
          query={queryTerm}
          setQuery={setQueryTerm}
          placeholder={getLabels().scopeSelection.searchJob}
          style={{
            backgroundColor: theme.colors.background,
          }}
        />
      </SearchContainer>
      {queryTerm.length > 0 ? (
        <FilteredJobList queryTerm={queryTerm} />
      ) : (
        <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
          <DisciplineContainer>{disciplineItems}</DisciplineContainer>
        </ServerResponseHandler>
      )}
    </>
  )
}

export default JobSelection
