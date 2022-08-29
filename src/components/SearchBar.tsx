import React, { ReactElement } from 'react'

import { CloseIcon, MagnifierIcon } from '../../assets/images'
import labels from '../constants/labels.json'
import CustomTextInput from './CustomTextInput'
import PressableOpacity from './PressableOpacity'

interface Props {
  query: string
  setQuery: (input: string) => void
}

const SearchBar = ({ query, setQuery }: Props): ReactElement => (
  <CustomTextInput
    value={query}
    onChangeText={setQuery}
    placeholder={labels.dictionary.enterWord}
    rightContainer={
      <PressableOpacity onPress={() => setQuery('')}>
        {query === '' ? <MagnifierIcon /> : <CloseIcon />}
      </PressableOpacity>
    }
  />
)

export default SearchBar
