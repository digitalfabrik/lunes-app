import React, { ReactElement } from 'react'
import { useTheme } from 'styled-components/native'

import { MagnifierIcon } from '../../assets/images'
import { getLabels } from '../services/helpers'
import CustomTextInput from './CustomTextInput'

interface SearchBarProps {
  query: string
  setQuery: (input: string) => void
}

const SearchBar = ({ query, setQuery }: SearchBarProps): ReactElement => {
  const theme = useTheme()
  return (
    <CustomTextInput
      value={query}
      clearable
      onChangeText={setQuery}
      placeholder={getLabels().search.enterWord}
      rightContainer={<MagnifierIcon width={theme.spacingsPlain.md} height={theme.spacingsPlain.md} />}
    />
  )
}

export default SearchBar
