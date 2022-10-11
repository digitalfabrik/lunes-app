import React, { ReactElement } from 'react'

import { CloseIcon, MagnifierIcon } from '../../assets/images'
import { getLabels } from '../services/helpers'
import CustomTextInput from './CustomTextInput'
import PressableOpacity from './PressableOpacity'

interface SearchBarProps {
  query: string
  setQuery: (input: string) => void
}

const SearchBar = ({ query, setQuery }: SearchBarProps): ReactElement => (
  <CustomTextInput
    value={query}
    onChangeText={setQuery}
    placeholder={getLabels().search.enterWord}
    rightContainer={
      <PressableOpacity onPress={() => setQuery('')}>
        {query === '' ? <MagnifierIcon /> : <CloseIcon />}
      </PressableOpacity>
    }
  />
)

export default SearchBar
