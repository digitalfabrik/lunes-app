import React, { useMemo, ReactElement } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { CheckCircleIconGreen } from '../../../assets/images'
import { JobListItem } from '../../components/DisciplineListItem'
import SearchBar from '../../components/SearchBar'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import useLoadAllJobs from '../../hooks/useLoadAllJobs'
import useStorage from '../../hooks/useStorage'
import { StandardJob } from '../../models/Job'
import { getLabels, searchJobs } from '../../services/helpers'

const SearchContainer = styled.View`
  margin: ${props => props.theme.spacings.sm};
`

const JobContainer = styled.View`
  margin: 0 ${props => props.theme.spacings.sm};
`

const EmptyListIndicator = styled.Text`
  font-size: ${props => props.theme.fonts.largeFontSize};
  font-family: ${props => props.theme.fonts.contentFontBold};
  text-align: center;
  background-color: ${props => props.theme.colors.backgroundAccent};
  padding: ${props => props.theme.spacings.sm};
`

const IconContainer = styled.View`
  margin-right: ${props => props.theme.spacings.sm};
`

type JobSelectionProps = {
  queryTerm: string
  setQueryTerm: (newString: string) => void
  onSelectJob: (job: StandardJob) => void
  onUnselectJob?: (job: StandardJob) => void
}

const JobSelection = ({ queryTerm, setQueryTerm, onSelectJob, onUnselectJob }: JobSelectionProps): ReactElement => {
  const { data: allJobs, error, loading, refresh } = useLoadAllJobs()
  const theme = useTheme()
  const [selectedJobs] = useStorage('selectedJobs')

  const filteredJobs = useMemo(
    () => (queryTerm.length === 0 ? allJobs : searchJobs(allJobs, queryTerm)),
    [allJobs, queryTerm],
  )
  const jobItems = filteredJobs?.map(item => {
    const isSelected = selectedJobs?.includes(item.id.id)
    return (
      <JobListItem
        key={item.id.id}
        job={item}
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
      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        <JobContainer>
          {jobItems}
          {!!filteredJobs && filteredJobs.length === 0 && (
            <EmptyListIndicator>{getLabels().scopeSelection.noJobsFound}</EmptyListIndicator>
          )}
        </JobContainer>
      </ServerResponseHandler>
    </>
  )
}

export default JobSelection
